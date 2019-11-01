const express = require("express");
const router = express.Router();
const parseRange = require("range-parser");
var path = require("path");
var torrentStream = require("torrent-stream");
var fs = require("fs");
var download = require("download-file");
const imdb = require("imdb-api");
const OS = require("opensubtitles-api");
const auth = require("../middleware/auth");

const OpenSubtitles = new OS({
  useragent: "TemporaryUserAgent",
  username: "hyper_tube",
  password: "2019",
  ssl: true
});
OpenSubtitles.login()
  .then(res => {})
  .catch(err => {
    console.log(err);
  });

const opts = {
  connections: 100,
  uploads: 10,
  path: "./public",
  verify: true,
  dht: true,
  tracker: true,
  trackers: [
    "udp://tracker.openbittorrent.com:80",
    "udp://tracker.ccc.de:80",
    "udp://open.demonii.com:1337/announce",
    "udp://tracker.openbittorrent.com:80",
    "udp://tracker.coppersurfer.tk:6969",
    "udp://glotorrents.pw:6969/announce",
    "udp://tracker.opentrackr.org:1337/announce",
    "udp://torrent.gresille.org:80/announce",
    "udp://p4p.arenabg.com:1337",
    "udp://tracker.leechers-paradise.org:6969"
  ]
};

router.get("/checkHash/:hash", auth, function(req, res) {
  const getTorrentFile = new Promise(function(resolve, reject) {
    var hash = req.params.hash;
    try {
      var engine = torrentStream("magnet:?xt=urn:btih:" + hash + "", opts);
      resolve("Done");
    } catch {
      throw "Invalid Hash";
    }
  });
  getTorrentFile
    .then(function(file) {
      res.send("Done");
    })
    .catch(function(e) {
      res.send("ERROR");
    });
});

///////////////

router.post("/addMovie", auth, (req, res) => {
  const addquery = "INSERT INTO list (movie_id, user_id) values (?, ?)";
  db.query(addquery, [req.body.movie_id, req.id], (error, results) => {
    if (results) res.send({ status: "success", msg: "movie added" });
    else res.send({ status: "failure", msg: error });
  });
});

router.post("/removeMovie", auth, (req, res) => {
  const addquery = "DELETE FROM list WHERE movie_id = ?";
  db.query(addquery, [req.body.movie_id], (error, results) => {
    if (results) res.send({ status: "success", msg: "movie removed" });
    else res.send({ status: "failure", msg: error });
  });
});

///////////////

router.get("/:hash", function(req, res) {
  const getTorrentFile = new Promise(function(resolve, reject) {
    var hash = req.params.hash;
    var engine = torrentStream("magnet:?xt=urn:btih:" + hash + "", opts);
    engine.on("ready", function() {
      engine.files.forEach(function(file, idx) {
        const ext = path.extname(file.name).slice(1);
        if (ext === "mkv" || ext === "mp4") {
          file.ext = ext;
          resolve(file);
        }
      });
    });
  });

  res.setHeader("Accept-Ranges", "bytes");
  getTorrentFile
    .then(function(file) {
      var array = file.path.split("/");
      const query = "SELECT * FROM movies where hash = ?";
      const query2 =
        "INSERT INTO movies (hash,path,watched_at) values (?, ?, ?)";
      const query3 = "UPDATE movies SET watched_at = ? WHERE hash = ?";
      db.query(query, [req.params.hash], (err, result) => {
        if (err) console.log(err);
        if (result.length > 0) {
          db.query(query3, [new Date(), req.params.hash], (err, result) => {
            if (err) console.log(err);
          });
        } else {
          db.query(
            query2,
            [req.params.hash, array[0], new Date()],
            (err, result) => {
              if (err) console.log(err);
            }
          );
        }
      });
      res.setHeader("Content-Length", file.length);
      res.setHeader("Content-Type", `video/${file.ext}`);
      if (req.headers.range) {
        const ranges = parseRange(file.length, req.headers.range, {
          combine: true
        });
        if (ranges === -1) {
          // 416 Requested Range Not Satisfiable
          res.statusCode = 416;
          return res.end();
        } else if (
          ranges === -2 ||
          ranges.type !== "bytes" ||
          ranges.length > 1
        ) {
          // 200 OK requested range malformed or multiple ranges requested, stream entire video
          if (req.method !== "GET") return res.end();
          return file.createReadStream().pipe(res);
        } else {
          // 206 Partial Content valid range requested
          const range = ranges[0];
          res.statusCode = 206;
          res.setHeader("Content-Length", 1 + range.end - range.start);
          res.setHeader(
            "Content-Range",
            `bytes ${range.start}-${range.end}/${file.length}`
          );
          if (req.method !== "GET") return res.end();
          return file.createReadStream(range).pipe(res);
        }
      } else {
        var stream = file.createReadStream();
      }
    })
    .catch(function(e) {
      res.send("ERROR");
    });
});

//////////////

router.post("/search/getimg", auth, function(req, res) {
  imdb
    .get({ id: req.body.imdb_id }, { apiKey: "88736563", timeout: 30000 })
    .then(respo => {
      res.send(respo);
    })
    .catch(function() {
      res.send("ERROR");
    });
});

router.post("/getSubt", auth, async (req, res) => {
  OpenSubtitles.search({
    imdbid: req.body.imdb_id
  }).then(async subtitles => {
    const values = Object.values(subtitles);
    if (fs.existsSync("./client/public/subtitles/" + req.body.imdb_id)) {
    } else {
      values.forEach((subtitle, index) => {
        var url = subtitle.vtt;
        var options = {
          directory: "./client/public/subtitles/" + req.body.imdb_id,
          filename: subtitle.lang + ".vtt"
        };
        download(url, options, err => {});
      });
    }
    var transformation = [];
    for (var i = 0; i < values.length; i++) {
      var options = {
        directory: "./client/public/subtitles/" + req.body.imdb_id + "/",
        filename: values[i].lang + ".vtt"
      };
      if (fs.existsSync(options.directory + options.filename))
        transformation.push(values[i]);
    }
    res.send(transformation);
  });
});

router.post("/saveComment", auth, async (req, res) => {
  const query =
    "INSERT INTO comments (user_id,movie_id,comment) values (?, ?, ?)";
  db.query(
    query,
    [req.id, req.body.imdb_id, req.body.comment],
    (err, result) => {
      if (err) console.log(err);
      res.send(result);
    }
  );
});

router.post("/saveReply", auth, async (req, res) => {
  const query =
    "INSERT INTO replys (comment_id,user_id,movie_id,reply) values (?, ?, ?, ?)";
  db.query(
    query,
    [req.body.comment_id, req.id, req.body.imdb_id, req.body.reply],
    (err, result) => {
      if (err) console.log(err);
      res.send("saved");
    }
  );
});

router.post("/saveHistory", auth, async (req, res) => {
  const query = "SELECT * FROM history where movie_id = ? AND user_id = ?";
  const query2 = "INSERT INTO history (user_id,movie_id) values (?, ?)";
  const query3 = "UPDATE history SET watched_at = ? WHERE movie_id = ?";
  db.query(query, [req.body.imdb_id, req.id], (err, result) => {
    if (err) console.log(err);
    if (result.length > 0) {
      db.query(query3, [new Date(), req.body.imdb_id], (err, result) => {
        if (err) console.log(err);
        res.send("saved");
      });
    } else {
      db.query(query2, [req.id, req.body.imdb_id], (err, result) => {
        if (err) console.log(err);
        res.send("saved");
      });
    }
  });
});

router.post("/getHistory", auth, async (req, res) => {
  const query = "SELECT * FROM history where user_id = ? LIMIT 6";
  db.query(query, [req.body.id], (err, result) => {
    res.send(result);
  });
});

router.post("/getComments", auth, async (req, res) => {
  const query =
    "SELECT comments.id,comments.comment,comments.created_at,comments.user_id , users.username ,users.avatar FROM comments , users where comments.movie_id = ? AND comments.user_id = users.id ORDER BY created_at DESC";
  db.query(query, [req.body.imdb_id], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

router.post("/getReplys", auth, async (req, res) => {
  const query =
    "SELECT replys.reply,replys.created_at,replys.user_id , users.username ,users.avatar FROM replys , users where replys.comment_id = ? AND replys.user_id = users.id ORDER BY created_at DESC";
  db.query(query, [req.body.comment_id], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

router.post("/getListWatched", auth, async (req, res) => {
  const query = "SELECT movie_id FROM history where user_id = ?";
  db.query(query, [req.id], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

router.post("/getMyList", auth, async (req, res) => {
  const query = "SELECT movie_id FROM list where user_id = ?";
  db.query(query, [req.id], (err, result) => {
    if (result) res.send({ status: "success", msg: result });
    if (err) res.send({ status: "failuree", msg: err });
  });
});

////// extraApi
const PirateBay = require("thepiratebay");

router.post("/extraApi", auth, function(req, res) {
  PirateBay.search(req.body.imdb_id, {
    category: "video",
    orderBy: "seeds",
    sortBy: "desc"
  })
    .then(results => {
      res.send(results);
    })
    .catch(err => console.log(err));
});

/////////////

module.exports = router;

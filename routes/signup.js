const   express = require('express');
const   router = express.Router();
const   bcrypt = require('bcrypt');
const   multer  = require('multer');
const   path    = require('path')
const   multiparty = require('multiparty');
const   fs      = require('fs-extra')
const   Repitition = require('../middleware/Repitition')
const   saltRounds = 10;
const sizeOf = require('image-size');
var name = null;

const   storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let path = './client/public/images';
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename: (req, file, callback) => {
        fileName = Date.now() + path.extname(file.originalname)
        name = fileName
        callback(null, fileName)
    }
})

const   upload = multer({
    storage: storage,
    limits:{fileSize: 4096000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

function    checkFileType(file, cb){
    const   filetypes = /jpeg|jpg|png/
    const   extname   = filetypes.test(path.extname(file.originalname).toLowerCase())
    const   mimetype  = filetypes.test(file.mimetype)
    
    if (mimetype && extname)
        return cb(null, true);
    else
        return ("8")
}

function UploadImage(req, res)
{
    return new Promise((resolve, reject) => {
        upload(req, res, async (err) => 
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                if (req.file == undefined)
                    reject("9");
                else
                {
                    resolve('images/'+fileName)
                }
            }
        })
    })
}

function InsertData(image, vkey, first_name, last_name, username, password, email)
{
    return new Promise((resolve, reject) => {
        try
        {
            var     dimensions = sizeOf('./client/public/images/'+name);

            if (dimensions.width && dimensions.height)
            {
                const query = "INSERT INTO users (username, avatar, first_name, last_name, password, email, verification_code) values (?, ?, ?, ?, ?, ?, ?)"
                db.query(query, [username, image, first_name, last_name, password, email, vkey], (error, results) => {
                    if (error)
                        reject("10")
                    else
                        resolve("data inserted")
                })
            }
        }
        catch
        {
            reject("8")
        }  
    })
}

function SendMail(vkey, email, username)
{
    return new Promise((resolve, reject) => {

        let link = "http://localhost:3001/signup/verify?key="+vkey;
        mailOptions = {
              to : email,
              subject : "Hypertube Email confirmation",
              html : "<h6>Hello " + username + ",</h6><br> <p>Please Click link below to verify your email.</p><br><a href="+link+">Click here to verify</a>"
        }
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error) 
                reject("10")
            else
                resolve("Mail was sent");
        });
    })
}

router.post('/', (req, res) => {
    credentials = JSON.parse(req.headers['credentials-header']);
    var username  = credentials.username;
    var password  = credentials.password;
    var email     = credentials.email;
    var first_name = credentials.first_name;
    var last_name = credentials.last_name;
    var salt      = bcrypt.genSaltSync(saltRounds);
    var hash_pass = bcrypt.hashSync(password, salt);
    var vkey      = Math.random().toString(36).substring(7);

    Repitition.CheckData(first_name, last_name, username, password, email)
    .then(rep => Repitition.UsernameExists(username, -1))
    .then(rep => Repitition.EmailExists(email, -1))
    .then(rep => UploadImage(req, res))
    .then(rep => InsertData(rep, vkey, first_name, last_name, username, hash_pass, email))
    .then(rep => SendMail(vkey, email, username))
    .then(success => res.send({status: "success", msg: "Account was created successfully"}))
    .catch(error => res.send({status: 'failure', msg: error}))
})

router.get('/verify', (req, res) => {
    db.query('SELECT `id` FROM `users` WHERE `verification_code` = ?', [req.query.key], function (error, results, fields){
    if (results.length == 1){
        var insertQuery = "UPDATE users SET  email_verified =  ?, verification_code = ? WHERE `id` = ?";
        db.query(insertQuery, [1, '0', results[0].id]);
        res.render("EmailVerif.html")
    }
    else
    {
        res.render("ErrorReq.html")
    }})
})


module.exports = router;
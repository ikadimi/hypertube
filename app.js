const express = require('express')
const mysql = require('mysql')
const config = require('config')
const nodeMailer = require("nodemailer")
const bodyParser = require('body-parser')
const signup = require('./routes/signup.js')
const login = require('./routes/login.js')
const forgot = require('./routes/forgot.js')
const profile = require('./routes/profile.js')
const settings = require('./routes/settings.js')
const video = require('./routes/video.js')
const GitHubStrategy = require('passport-github').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
const jwt = require('jsonwebtoken');
var rimraf = require("rimraf");
const app = express()
const port = process.env.PORT || 3001

app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/static');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.json())
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GitHubStrategy({
	clientID: "27a9974ecf7cb9a53415",
	clientSecret: "bbcb8d88ad81aaf0b4a70b7c03a32c9f8c89f1f2",
	callbackURL: "http://localhost:8080/login/github",
	scope: ['user:email']
}, (accessToken, refreshToken, profile, done) => {
	return done(null, profile);
}
));

passport.use(new GoogleStrategy({
	clientID: "720391957482-1jhj256krm792l7l8qb3at7jf5qv5ep4.apps.googleusercontent.com",
	clientSecret: "VHUrIDb6zlyv7zM-En2Y5D4E",
	callbackURL: "http://localhost:8080/login/google",
	scope: ['profile', 'email']
},
	function (accessToken, refreshToken, profile, done) {
		return done(null, profile);
	}
));

const db = mysql.createConnection(config.get('Database'))

db.connect((err) => {
	if (err)
		console.log(err)
	else
		console.log('Connected to database');
});
global.db = db;

var allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-auth-token, Credentials-Header');
	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.sendStatus(200);
	}
	else {
		next();
	}
};

// supprimé un film n’est pas visionné pendant un mois
var dayInMilliseconds = 1000 * 60 * 60 * 24;
var month = 1000 * 60 * 60 * 24 * 30;
const query = "SELECT * FROM movies";
const query2 = "DELETE FROM `movies` WHERE hash = ?";
setInterval(function () {
	db.query(query, (err, result) => {
		var date = new Date();
		result.forEach(element => {
			if (date - element.watched_at > month) {
				var dist = './public/' + element.path;
				rimraf.sync(dist);
				db.query(query2, [element.hash]);
			}
		});
	})
}, dayInMilliseconds);
// supprimé un film n’est pas visionné pendant un mois
app.use(allowCrossDomain);

let smtpTransport = nodeMailer.createTransport(config.get("Mail"));
global.smtpTransport = smtpTransport;


/*    teeeeeaaammmmmm */

var cors = require('cors');
app.use(cors())

/*  teammmmmmmmmmmmmm */

app.use('/video', video)
app.use('/signup', signup);
app.use('/login', login);
app.use('/forgot', forgot);
app.use('/settings', settings);
app.use('/profile', profile);


const PirateBay = require('thepiratebay');

app.get('/extraApi', function (req, res) {
  PirateBay.search('tt1825683', {
    category: 'video',
    orderBy: 'seeds',
	sortBy: 'desc',
  })
  .then(results => {
    res.send(results);
  })
  .catch(err => {
	this.$router.push({ name: "home" });
  })
});

app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.send('<h1 style="color:red;">Fiiin ghadii !!! Error with status 500</h1>');
});

app.get('*', (req, res) => {
	res.render('404.html');
})


app.listen(port, function () {
	console.log('Example app listening on port ' + port);
})
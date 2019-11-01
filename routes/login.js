const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const passport = require('passport')
const Repitition = require('../middleware/Repitition')


function    usernameExists(username) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE username = ?',[username], function (error, results, fields) {
            if (results.length == 1) resolve("username Success") 
            else reject("1")
        })
    })
}

function    correctPassword(username, password) {
    return new Promise((resolve, reject) => {
        db.query('SELECT password FROM users WHERE username = ?', [username], function (error, results, fields) {
            if (bcrypt.compareSync(password, results[0].password)) resolve("password Success") 
            else reject("2")
        })
    })
}

function   isMailVerif(username, req) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM `users` WHERE username = ?',[username], function (error, results, fields){
            if (results[0].email_verified == 1){
                resolve(jwt.sign({ id: results[0].id}, 'jwtPrivateKey'));
            } else reject("3")
        })
    })
}

router.post('/', function(req, res){
    let username = req.body.username;
    let password = req.body.password;

    usernameExists(username)
    .then (name => correctPassword(username, password))
    .then (pass => isMailVerif(username))
    .then (token => res.send({status: "success" , Token: token}))
    .catch (err => res.send({status: "failure" , msg: err}))
});

router.post('/42', (req, res) => {
    let options = {
        headers: {'Authorization': 'Bearer ' + req.body.token}
    };
    axios.get("https://api.intra.42.fr/v2/me", options)
    .then(Response => {
        let user = Response.data;
        const query = "SELECT * from users WHERE password = ?"
            db.query(query, [user.id], (error, results) => {
                if (results.length == 0)
                {
                    const checkQuery = "SELECT * from users WHERE username = ? OR email = ?"
                    db.query(checkQuery, [user.login, user.email], (error, results) => {
                    if (results.length == 0)
                    {
                        const query = "INSERT INTO users (username, avatar, first_name, last_name, password, email, verification_code, email_verified) values (?, ?, ?, ?, ?, ?, ?, ?)"
                        db.query(query, [user.login, user.image_url, user.first_name, user.last_name, user.id, user.email, 0, 1], (error, results) => {
                            if (results)
                                res.send({status: "success", msg: jwt.sign({id: results.insertId}, 'jwtPrivateKey')})
                            else
                                res.send({status: "failure", msg: "6"})
                        })
                    }
                    else if (results.length > 0)
                        res.send({status: "failure", msg: "4"})
                    else
                        res.send({status: "failure", msg: "5"})
                    })
                }
                else if (results.length == 1)
                    res.send({status: "success", msg: jwt.sign({ id: results[0].id}, 'jwtPrivateKey')})
                else
                    res.send({status: "failure", msg: "5"})
            })
    })
    .catch(error => res.send({status: "failure", msg: error.message}))
})

router.get('/github', passport.authenticate('github', {session: false}), function(req, res) {
    let user = JSON.parse(req.user._raw)
    let email = ""
    if (user.email != null)
        email = user.email
    Repitition.OutsideLogin(user.login, user.login, user.login, email, user.avatar_url, user.id)
    .then(finish => res.send({status: "success", msg: finish}))
    .catch(error => res.send({status: "failure", msg: error}))
});

router.get('/google', passport.authenticate('google', {session: false}), function(req, res) {
    let user = req.user
    Repitition.OutsideLogin(user._json.given_name, user._json.given_name, user._json.family_name, user._json.email, user._json.picture, user.id)
    .then(finish => res.send({status: "success", msg: finish}))
    .catch(error => res.send({status: "failure", msg: error}))
});

module.exports = router
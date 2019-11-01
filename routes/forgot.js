const express   = require('express');
const router    = express.Router();
const  bcrypt = require('bcrypt');
const  saltRounds = 10;

function SendMail(key, lang, email)
{
    return new Promise((resolve, reject) => {
        let link = `http://localhost:8080/${lang}/resset?key=${key}`
        mailOptions = {
              to : email,
              subject : "Hypertube password reset",
              html : "<h6>Hi there!</h6><br> <p>You recently asked to resset your password:</p> <br> <a href='" + link +"'> Resset Password </a>"
        }
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error) 
                reject("3")
            else
                resolve("Mail was sent");
        });
    })
}

function isNumeric(value) {
    return /^\d+$/.test(value);
}

function    EmailExists(email)
{
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields){
        if (results.length == 0)
            reject("1")
        else if (results.length == 1 && isNumeric(results[0].password))
            reject("2")
        else if (results.length == 1 && !isNumeric(results[0].password) && results[0].email_verified == 0)
            reject("7")
        else if (results.length == 1 && !isNumeric(results[0].password))
            resolve(results[0].username)
        else
            reject("3")
    })
    })
}

function    NewKey(email)
{
    return new Promise((resolve, reject) => {
        let vkey = Math.random().toString(36).substr(3) + Math.random().toString(36).substr(3);
        db.query('UPDATE users SET password_resset = ? WHERE email = ?', [vkey, email], function (error, results, fields){
        if (results)
            resolve(vkey)
        else
            reject("3")
    })
    })
}

router.post('/', (req, res) => {
    let email = req.body.email
    let lang = req.body.lang

    EmailExists(email)
    .then(rep => NewKey(email))
    .then(key => SendMail(key, lang, email))
    .then(finish => res.send({status: "success", msg: finish}))
    .catch(error => res.send({status: "failure", msg: error}))

})

function CheckData(password, key)
{
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM users WHERE password_resset = ?"
        db.query(query, [key], (error, results) => {
            if (results.length == 1)
            {
                if (bcrypt.compareSync(password, results[0].password))
                    reject("8")
                else
                {
                    let passRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,20}$/)
                    if (!(passRegex.test(password)))
                        reject("5")
                    else
                        resolve("data_clear")
                }
            }
            else
                reject("6")
        })
    })
}

function    updatePassword(key, password)
{
    return new Promise((resolve, reject) => {
        db.query('UPDATE users SET password = ?, password_resset = ? WHERE password_resset = ?', [password, 0, key], function (error, results, fields){
        if (results)
            resolve("Password reset was successful")
        else
            reject("3")
    })
    })
}

router.post('/resset', (req, res) => {
    let key = req.body.key
    let password = req.body.password
    let passwordConf = req.body.passwordConf
    let salt      = bcrypt.genSaltSync(saltRounds);
    let hash_pass = bcrypt.hashSync(password, salt);

    if (password != passwordConf)
        res.send({status: "failure", msg: "4"})
    else
    {
        CheckData(password, key)
        .then(name => updatePassword(key, hash_pass))
        .then(finish => res.send({status: "success", msg: finish}))
        .catch(error => res.send({status: "failure", msg: error}))
    }
})

module.exports = router
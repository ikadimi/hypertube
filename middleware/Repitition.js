const jwt = require('jsonwebtoken');

var methods = {
    CheckData: function(first_name, last_name, username, password, email)
    {
        return new Promise((resolve, reject) => {
            let regex = new RegExp(/^[a-zA-Z]{3,20}$/i);
            let userRegex = new RegExp(/^[a-zA-Z0-9]{3,20}$/i);
            let mailRegex = new RegExp(/^(?!.{254})(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            let passRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,20}$/)

            if (!(regex.test(first_name)))
                reject("1")
            else if (!(regex.test(last_name)))
                reject("2")
            else if (!(userRegex.test(username)))
                reject("3")
            else if (!(mailRegex.test(email)))
                reject("4")
            else if (!(passRegex.test(password)))
                reject("5")
            else
                resolve("data_clear")
        })
    },

    UsernameExists: function(username, id)
    {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields){
            if (results.length == 0) 
                resolve("username Success")
            else if (results.length == 1)
            {
                if (results[0].id === id)
                    resolve("username Success")
                else
                    reject("6") 
            }
            else
                reject("6") 
        })
        })
    },

    EmailExists: function(email, id)
    {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields){
            if (results.length == 0)
                resolve("Email Success")
            else if (results.length == 1)
            {
                if (results[0].id === id)
                    resolve("Email Success")
                else
                    reject("7")
            }
            else
                reject("7")
        })
        })
    },

    OutsideLogin: function(username, first_name, last_name, email, avatar, password)
    {
        return new Promise((resolve, reject) => {
            const query = "SELECT * from users WHERE password = ?"
            db.query(query, [password], (error, results) => {
                if (results.length == 0)
                {
                    const checkQuery = "SELECT * from users WHERE username = ? OR email = ?"
                    db.query(checkQuery, [username, email], (error, results) => {
                    if (results.length == 0)
                    {
                        const query = "INSERT INTO users (username, avatar, first_name, last_name, password, email, verification_code, email_verified) values (?, ?, ?, ?, ?, ?, ?, ?)"
                        db.query(query, [username, avatar, first_name, last_name, password, email, 0, 1], (error, results) => {
                            if (results)
                                resolve(jwt.sign({id: results.insertId}, 'jwtPrivateKey'))
                            else
                                reject("6")
                        })
                    }
                    else if (results.length > 0)
                        reject("4")
                    else
                        reject("5")
                    })
                }
                else if (results.length == 1)
                    resolve(jwt.sign({ id: results[0].id}, 'jwtPrivateKey'))
                else
                    reject("5")
            })
        })
    }
}

module.exports = methods
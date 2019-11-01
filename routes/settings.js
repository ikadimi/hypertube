const express   = require('express');
const router    = express.Router();
const fs        = require('fs-extra')
const path      = require('path')
const multer    = require('multer');
const bcrypt = require('bcrypt');
const auth      = require('../middleware/auth')
const Repitition = require('../middleware/Repitition')
const sizeOf = require('image-size');
const saltRounds = 10;
let name = null;

function isNumeric(value) {
    return /^\d+$/.test(value);
}

router.get('/', auth, (req, res) => {
    const query = "SELECT * FROM users WHERE id = ?"
    db.query(query, [req.id], (error, results) => {
        if (results.length == 1)
        {
            let pass = '';
            if (isNumeric(results[0].password))
                pass = '1';
            let user = {
                id: results[0].id,
                username: results[0].username,
                first_name: results[0].first_name,
                last_name: results[0].last_name,
                email:results[0].email,
                avatar: results[0].avatar,
                password: pass,
                lang: results[0].lang
            }
            res.send(user)
        }
        else
            res.send("failure")
    })
})

const   storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let path = './client/public/images';
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename: (req, file, callback) => {
        fileName = Date.now() + path.extname(file.originalname)
        name = fileName;
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
        return cb(file.originalname + " isn't an image");
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
                    reject("No File Selected");
                else
                    resolve('images/'+fileName)
            }
        })
    })
}

function    updateAvatar(image, id)
{
    return new Promise((resolve, reject) => {
        try
        {
            var     dimensions = sizeOf('./client/public/images/'+name);

            if (dimensions.width && dimensions.height)
            {
                const query = "UPDATE users SET avatar = ? WHERE id = ?"
                db.query(query, [image, id], (error, results) => {
                    if (error)
                        reject("8")
                    else
                        resolve("image updated")
                })
            }
        }
        catch
        {
            reject("8")
        }  
    })
}

router.post('/updateImg', auth, (req, res) => {
    const query = "SELECT * FROM users WHERE id = ?"
    db.query(query, [req.id], (error, results) => {
        if (results.length == 1)
        {
            UploadImage(req, res)
            .then(image => {
                updateAvatar(image, req.id)
                .then(finish => res.send({status: "success", msg: "Image was uploaded successfully"}))
                .catch(err => res.send({status: "failure", msg: err}))
            })
            
        }
        else
            res.send({status: "failure", msg: error})
    })
})

function userUpdate(first_name, last_name, username, password, email, id)
{
    return new Promise((resolve, reject) => {
        const query = "UPDATE users SET first_name = ?, last_name = ?, username = ?, password = ?, email = ? WHERE id = ?"
        db.query(query, [first_name, last_name, username, password, email, id], (error, results) => {
            if (results)
                resolve("Data Updated successfully")
            else
                reject("updateQuery didn't deliver")
        })
    })
}

function userUpdate_2(first_name, last_name, username,email, id)
{
    return new Promise((resolve, reject) => {
        const query = "UPDATE users SET first_name = ?, last_name = ?, username = ?, email = ? WHERE id = ?"
        db.query(query, [first_name, last_name, username,email, id], (error, results) => {
            if (results)
                resolve("1")
            else
                reject("updateQuery didn't deliver")
        })
    })
}

function CheckData_2(first_name, last_name, username, email)
{
    return new Promise((resolve, reject) => {
        let regex = new RegExp(/^[a-zA-Z]{3,20}$/i);
        let userRegex = new RegExp(/^[a-zA-Z0-9]{3,20}$/i);
        let mailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

        if (!(regex.test(first_name)))
            reject("1")
        else if (!(regex.test(last_name)))
            reject("2")
        else if (!(userRegex.test(username)))
            reject("3")
        else if (!(mailRegex.test(email)))
            reject("4")
        else
        resolve("data_clear")
    })
}

router.post('/updateData', auth, (req, res) => {
    var username  = req.body.username;
    var password  = req.body.password;
    var email     = req.body.email;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var salt      = bcrypt.genSaltSync(saltRounds);
    var hash_pass = bcrypt.hashSync(password, salt);

    if (password === '' || password === null || password === '1')
    {
        CheckData_2(first_name, last_name, username, email)
        .then(rep => Repitition.UsernameExists(username, req.id))
        .then(rep => Repitition.EmailExists(email, req.id))
        .then(rep => userUpdate_2(first_name, last_name, username, email, req.id))
        .then(finish => res.send({status: "success", msg: finish}))
        .catch(error => res.send({status: "failure", msg: error}))
    }
    else
    {
        Repitition.CheckData(first_name, last_name, username, password, email)
        .then(rep => Repitition.UsernameExists(username, req.id))
        .then(rep => Repitition.EmailExists(email, req.id))
        .then(rep => userUpdate(first_name, last_name, username, hash_pass, email, req.id))
        .then(finish => res.send({status: "success", msg: finish}))
        .catch(error => res.send({status: "failure", msg: error}))
    }
})

module.exports = router
const express = require('express');
const bcrypt = require('bcrypt');
const fileread = require('fs');
const session = require('express-session')
const port = 80;
const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(
    session({
        secret: "ShivkumarChauhanat95",
        resave: false,
        saveUninitialized: true,
        maxAge: Date.now() + 150000
    })
);

app.post('/authenticateuser', (req, res) => {
    if (req.session.useremail) {
        res.status(200).json({
            username: req.session.username.toLowerCase()
        })
    } else {
        res.status(404).send("not found")
    }
})
app.post('/signup', (req, res) => {
    fileread.readFile('./database/users.json', (err, data) => {
        let userdata = JSON.parse(data)
        let alreadyexists = false;
        userdata.forEach((element, index) => {
            if (element.email === req.body.email || element.phone === req.body.phone) {
                alreadyexists = true
            }
        });
        if (alreadyexists === false) {
            bcrypt.hash(req.body.password, 12, function (err, hash) {
                let signupdata = {
                    name: req.body.name.trim().toLowerCase(),
                    email: req.body.email.trim().toLowerCase(),
                    phone: req.body.phone.trim(),
                    password: hash
                }
                userdata.push(signupdata);
                fileread.writeFile('./database/users.json', JSON.stringify(userdata), (err) => {
                    if (err) {
                        res.status(406).send({
                            message: "not acceptable"
                        })
                    } else {
                        res.status(200).json({
                            message: "signup done",
                            username: signupdata.name.split(" ")[0]
                        })
                    }
                })
            })
        } else {
            res.status(403).send({
                message: "already Exists"
            })
        }
    })
})
app.post('/login', (req, res) => {
    fileread.readFile('./database/users.json', (err, data) => {
        console.log(err);
        let userdata = JSON.parse(data)
        let alreadyexists = false;
        let index = 0
        for (index = 0; index < userdata.length; index++) {
            let element = userdata[index];
            if (element.email === req.body.email.toLowerCase()) {
                alreadyexists = true
                break
            }
        }
        if (alreadyexists === true) {
            let element = userdata[index];
            bcrypt.compare(req.body.password, element.password, function (err, result) {
                if (result === true) {
                    req.session.username = element.name.split(" ")[0];
                    req.session.useremail = element.email;
                    req.session.save((err) => {
                        if (err) {
                            console.log("error on session saving", err);
                        } else {
                            res.status(200).send({
                                message: "done login",
                                username: element.name.split(" ")[0]
                            })
                        }
                    })
                } else {
                    res.status(406).send("invalid credentials")
                }
            });
        } else {
            res.status(406).send({
                message: "invalid credentials"
            })
        }
    })
})

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        console.log("session Destroyed");
    })
    res.status(200).send("logged out")
})

app.listen(port, () => {
    console.log("Server is started at http://127.0.0.1:" + port);
})
'use strict';

//basic config section
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config.js');
let User = require('./schema/user-schema.js');

//configure express
const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//configure socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http);

//configure mongodb
mongoose.connect(config.database);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection failed:'));
db.once('open', function() {
    console.log('db connection established');
});

app.set('access', config.secret);


//configure routes
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname + '/about.html'));
});

app.post('/signup', function(req, res) {
    let submittedUser = {username: htmlEntities(req.body.username), password: htmlEntities(req.body.password)};

    User.findOne({username: submittedUser.username}, function(err, user) {
        if(err) throw err;

        if(user) {
            return res.json({ message: `A user account already exists for ${user.username}`, user: user.username});
        } else {
            let user = new User({
                username: submittedUser.username,
                password: submittedUser.password,
                approved: false
            });

            user.save(function(err) {
                if(err) throw err;

                User.findOne({username: req.body.username}, function(err, user) {
                    if(err) throw err;

                    return res.json({ success: true, pendingUser: user.username, approved: user.approved });
                });
            });
        }
    });
});

app.post('/login', function(req, res) {
    let submittedUser = {username: htmlEntities(req.body.username), password: htmlEntities(req.body.password)};

    User.findOne({username: submittedUser.username}, function(err, user) {
        if(err) throw err;

        if(user && user.approved) {
            if(user.password === submittedUser.password) {
                let token = jwt.sign(user, app.get('access'), {
                    expiresIn: "1h"
                });
                let response = {message: 'Logged In',
                                loggedIn: true,
                                user: user.username,
                                token: token
                            };
                if(user.motto) response.motto = user.motto;
                if(user.imgpath) response.imgpath = user.imgpath;

                return res.json(response);
            } else {
                return res.json({message: 'Invalid password', loggedIn: false});
            }
        } else if(user && !user.approved) {
            return res.json({message: 'User account pending approval', loggedIn: false});
        } else {
            return res.json({message: 'No user found', loggedIn: false});
        }
    });
});


//Protected routes below

//set up middleware to check for token passing on request
app.use('/horizons', function(req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log('using apiRoutes middleware');

    if(token) {
        console.log('token found');
        jwt.verify(token, app.get('access'), function(err, decoded) {
            if(err) {
                return res.json({message: 'Failed to authenticate', loggedIn: false});
            } else {
                console.log('token legit');
                req.decoded = decoded
                next();
            }
        });
    } else {
        return res.status(403).send({
            loggedIn: false,
            message: 'No token provided to protected route'
        });
    }
});

app.get('/horizons/profile', function(req, res) {
    res.send('profile info with react app here');
});

app.get('/horizons/chat', function(req, res) {
    res.sendFile(path.join(__dirname + '/chat.html'));
});


//socket.io chat config
io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('chat message', function(msg) {
        console.log('message passed: ', msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function() {
        console.log('a user disconnected');
    });
});

http.listen(8001, function() {
    console.log('listening on 8001');
});

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
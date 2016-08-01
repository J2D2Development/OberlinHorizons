'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    // console.log(req);
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/about', function(req, res) {
    // console.log(req);
    res.sendFile(path.join(__dirname + '/about.html'));
});

app.get('/chat', function(req, res) {
    // console.log(req);
    res.sendFile(path.join(__dirname + '/chat.html'));
});

app.post('/signup', function(req, res) {
    let user = {username: htmlEntities(req.body.username), password: htmlEntities(req.body.password)};
    res.json({ success: true, addedUser: user.username });
});

app.post('/login', function(req, res) {
    let user = {username: htmlEntities(req.body.username), password: htmlEntities(req.body.password)};

    for(let i = 0, l = db.length; i < l; i += 1) {
        if(db[i].username === user.username && db[i].password === user.password) {
            return res.json({ success: true, loggedInUser: db[i].username });
        }
    }
    return res.json({ success: false });
})

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

let db = [
    {
        username: "driscollj",
        password: "testpass"
    },
    {
        username: "treehorn",
        password: "legit"
    }
];
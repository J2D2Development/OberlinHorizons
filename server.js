var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

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
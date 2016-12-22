var express = require('express');
var ent = require('ent'); // Lock HTML character in tchat.
var fs = require('fs');
var http = require('http');
var socketIo = require('socket.io')

var app = express();
var server = http.createServer(app);
var io = socketIo.listen(server);


// Load chat.html.
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/chat.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    // New user.
    socket.on('newUser', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('newUser', pseudo);
    });

    // New message.
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 
});

server.listen(8080);
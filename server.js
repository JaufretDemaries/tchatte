var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// On a client connexion.
io.sockets.on('connection', function (socket) {
    //console.log('Un client est connecté !');

    // Send notification to the client.
    socket.emit('message', {content: 'Vous êtes bien connecté !'});
    socket.broadcast.emit('message', {content: 'Un autre client vient de se connecter.'});

	// "message" type received from the client.    
	socket.on('message', function (message) {
	    console.log(socket.pseudo + ' : ' + message.content);
	});

	// Add a new user.
	socket.on('newUser', function(pseudo) {
	    socket.pseudo = pseudo;
	});
});

server.listen(8080);
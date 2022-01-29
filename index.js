
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public' ));
app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

var usernames = {};

io.sockets.on('connection', function(socket){
	socket.on('sendchat', function(data){
		io.sockets.emit('updatechat', socket.username, data);
	});
	socket.on('adduser', function (username){
		socket.username = username;
		usernames[username] = username;

		socket.emit('updatechat', 'iChat', ' Welcome ' + username);
		socket.broadcast.emit('updatechat', 'iChat', username + ' joined ');

	});
	
	socket.on('fileUpload', (data, imgurl) => {
		io.sockets.emit('fileUpload', socket.username, data, imgurl);
	});
});

server.listen(3000, () =>{
	console.log("Server is Running At Port: 3000 ");

});
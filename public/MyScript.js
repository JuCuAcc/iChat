/// <reference path = "jquery-3.3.1.min.js" />

var socket;
var fileName;

$(document).ready(function(){

	socket = io.connect('http://localhost:3000');
	
	socket.on('connect', addUser);
	socket.on('updatechat' , processMessage);
	
	socket.on('fileUpload' , sendFile);

	$('#send').click(sendMessage);
	$('#uploadFile').on('change' , uploadFile);

});

function uploadFile(e) {
	let file = e.target.files[0];
	let fileReader = new FileReader();

	fileReader.onload = (event) => {
		fileName = event.target.result
	};
	fileReader.readAsDataURL (file);
};

function addUser() {
	socket.emit('adduser', prompt("Please, Enter Your Name "));
}
function processMessage(username, data) {

	document.querySelector('#output_msg').innerHTML += '<b>' + username + ': </b>' + data + '<br>';
}

function sendMessage() {
	var message = $('#message').val();
	if (message != "") {
		$('#message').val('');
		socket.emit('sendchat', message);
		$('#message').focus();
		$('#message').val('');
	}
	else if (fileName != "") {
		sendImage(message, fileName)
		fileName = "";
		$('#message').focus();
		$('#message').val('');
	}
	else {
		$('#message').val('');
		$('#message').focus();
	}
}

function sendFile(username, data, imgurl) {
	let label = document.createElement('label');
	let img = document.createElement('img');
	let text = document.createElement('p');

	text.innerHTML = data;
	label.innerHTML = username;
	label.setAttribute('id', 'userHeading');
	text.setAttribute('id', 'msg');
	img.setAttribute('id', 'userImg');

	img.src = imgurl;
	let br = document.createElement('br');

	document.querySelector('#output_msg').appendChild(label);
	document.	querySelector('#output_msg').appendChild(text);
	document.querySelector('#output_msg').appendChild(img);
	document.querySelector('#output_msg').appendChild(br);

	document.querySelector('#outputFile').value = "";  //output file
}

function sendImage(message, fileName) {
	socket.emit('fileUpload', message, fileName);
}
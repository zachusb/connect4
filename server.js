var express = require("express");
var app = express();
var http = require("http");
var server = http.Server(app);
var socketio = require("socket.io");
var io = socketio(server);
app.use(express.static("pub"));


//Every time a client connects (visits the page) this function(socket) {...} gets executed.
//The socket is a different object each time a new client connects.
io.on("connection", function(socket) {
	console.log("Somebody connected.");

	socket.on("disconnect", function() {
		//This particular socket connection was terminated (probably the client went to a different page
		//or closed their browser).
		console.log("Somebody disconnected.");
	});

	socket.on("saySomething", function(dataFromClient) {
		console.log(dataFromClient);
		var s = new Date();
		//socket.emit() sends back to that same client.
		//io.emit() sends back to all clients.
		socket.emit("sayBack", "From server, time="+s+": " + dataFromClient);
	});

});


server.listen(80, function() {
	console.log("Server with socket.io is ready.");
});


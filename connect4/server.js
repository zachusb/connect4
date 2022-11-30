var express = require("express");
var app = express();
var http = require("http");
var server = http.Server(app);
var socketio = require("socket.io");
var io = socketio(server);
app.use(express.static("pub"));


//Every time a client connects (visits the page) this function(socket) {...} gets executed.
//The socket is a different object each time a new client connects.

let userList = {};
let connectCounter = 0;

io.on("connection", function(socket) {
	++connectCounter;
	if(connectCounter == 2){
		startGame();
	}
	console.log("Connected with id " + socket.id);
	console.log(connectCounter + " players connected")
	userList[socket.id] = {
		username: null,
		roundsPlayed: null,
		roundsCorrect: null,
		roundsWon: null,
		correctThisRound: false,
		wonThisRound: false
	};
	userList[socket.id].username = connectCounter;

	

	socket.on("disconnect", function() {
		//This particular socket connection was terminated (probably the client went to a different page
		//or closed their browser).
		--connectCounter;
		console.log(connectCounter + " players connected")
		console.log("Id " + socket.id + " disconnected.");
	});

	socket.on("saySomething", function(dataFromClient) {
		console.log(dataFromClient);
		var s = new Date();
		//socket.emit() sends back to that same client.
		//io.emit() sends back to all clients.
		socket.emit("sayBack", "From server, time="+s+": " + dataFromClient);
	});

	
	socket.emit("sendName", userList[socket.id].username);

});

function startGame() {
	//Board is cleared
	io.emit("clearBoard");
	//Player one starts
	playerOneTurn();
}

function playerOneTurn() {
	//io.emit to tell who's turn it is
	//update board when button is pressed
	//if won then gameover
	//else pass to player two
}

function playerTwoTurn() {
	//io.emit to tell who's turn it is
	//update board when button is pressed
	//if won then gameover
	//else pass to player two
}



server.listen(80, function() {
	console.log("Server with socket.io is ready.");
});


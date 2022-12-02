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
let adjectives = ["Stanky", "Nasty", "Dank", "Wet", "Fuzzy", "Musty"];
let noun = ["Wampus", "Slime", "Octopus", "Creep", "Tortoise"];
let userQueue = [];
let playerOne = userQueue[0].userList.username;
let playerTwo = userQueue[1].userList.username;

function randomFromArray(arr) {
	return arr[Math.floor(arr.length * Math.random())];
}

function randomUser() {
	return randomFromArray(adjectives) + randomFromArray(noun);
}

io.on("connection", function(socket) {
	++connectCounter;
	if(connectCounter == 2){
		startGame();
	}
	console.log("Connected with id " + socket.id);
	console.log(connectCounter + " players connected")
	userList[socket.id] = {
		username: randomUser(),
	};
	userQueue.push(userList[socket.id].username);
	

	

	socket.on("disconnect", function() {
		--connectCounter;
		console.log(connectCounter + " players connected")
		console.log("Id " + socket.id + " disconnected.");
	});

	socket.on("saySomething", function(dataFromClient) {
		console.log(dataFromClient);
		var s = new Date();
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
	io.emit("whosTurnIsIt", playerOne);
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


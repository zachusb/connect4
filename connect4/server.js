var express = require("express");
var app = express();
var http = require("http");
var server = http.Server(app);
var socketio = require("socket.io");
var io = socketio(server);
app.use(express.static("pub"));



let userList = {};
let connectCounter = 0;
let adjectives = ["Stanky", "Nasty", "Dank", "Wet", "Fuzzy", "Musty", "Tasty"];
let noun = ["Wampus", "Slime", "Octopus", "Creep", "Tortoise"];
let userQueue = [];
let playerOne;
let playerTwo;
let gameover = false;

function randomFromArray(arr) {
	return arr[Math.floor(arr.length * Math.random())];
}

function randomUser() {
	return randomFromArray(adjectives) + randomFromArray(noun);
}

io.on("connection", function(socket) {
	++connectCounter;
	
	console.log("Connected with id " + socket.id);
	console.log(connectCounter + " players connected")
	userList[socket.id] = {
		username: randomUser(),
		playerNumber: 2
	};
	userQueue.push(socket.id);
	

	socket.on("disconnect", function() {
		--connectCounter;
		console.log(connectCounter + " players connected")
		console.log("Id " + socket.id + " disconnected.");
		let i = userQueue.indexOf(socket.id);
		userQueue.splice(i, 1);
		delete userList[socket.id];
	});

	socket.on("saySomething", function(dataFromClient) {
		console.log(dataFromClient);
		var s = new Date();
		socket.emit("sayBack", "From server, time="+s+": " + dataFromClient);
	});

	socket.on("addChip", (bottomId, color) => {
		io.emit("sendBottomId", bottomId, color);
		if(color == "black"){
			playerTwoTurn();
		}
		if(color == "red"){
			playerOneTurn();
		}
	});

	socket.on("gameover", (color) => {
		gameover = true;
		io.emit("globalGameover",color);
	});
	
	socket.emit("sendName", userList[socket.id].username);
	if(connectCounter == 2){
		startGame();
	}

});

function startGame() {
	//Board is cleared
	io.emit("clearBoard");
	//Player one starts
	playerOne = userList[userQueue[0]];
	playerTwo = userList[userQueue[1]];
	//playerOne.playerNumber = 1;
	//playerTwo.playerNumber = 2;
	playerOneTurn();
}

function playerOneTurn() {
	//io.emit to tell who's turn it is
	//let one = "one"
	playerOne.playerNumber = 1;
	io.emit("whosTurnIsIt", playerOne/*, one*/);
	//update board when button is pressed
	//if won then gameover
	if(gameover){
		//do something
	}
	//else pass to player two
}

function playerTwoTurn() {
	//io.emit to tell who's turn it is
	let two = "two"
	//playerTwo.playerNumber = 2;
	io.emit("whosTurnIsIt", playerTwo/*, two*/);
	//update board when button is pressed
	//if won then gameover
	if(gameover){
		//do something
	}
	//else pass to player two
}



server.listen(80, function() {
	console.log("Server with socket.io is ready.");
});


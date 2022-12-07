var express = require("express");
var app = express();
var http = require("http");
var server = http.Server(app);
var socketio = require("socket.io");
var io = socketio(server);
app.use(express.static("pub"));



let userList = {};
let connectCounter = 0;
let adjectives = ["Wafty", "Nasty", "Lurking", "Wet", "Fuzzy", "Musty", "Tasty", "Dry"];
let noun = ["Wampus", "Slime", "Octopus", "Creep", "Tortoise", "Doorknob", "Dingus", "Chungus", "Florpus"];
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

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
 }

io.on("connection", function(socket) {
	++connectCounter;
	
	console.log("Connected with id " + socket.id);
	console.log(connectCounter + " players connected")
	userList[socket.id] = {
		username: randomUser(),
		playerNumber: 0
	};
	userQueue.push(socket.id);
		
	
	
	socket.on("disconnect", async function() {
		--connectCounter;
		console.log(connectCounter + " players connected")
		console.log("Id " + socket.id + " disconnected.");
		if(socket.id == userQueue[0] || socket.id == userQueue[1]){
			io.emit("globalGameover", "Player left! Plz wait for next game to start!");
		}
		let i = userQueue.indexOf(socket.id);
		userQueue.splice(i, 1);
		delete userList[socket.id];
		await sleep(5000);
		if(userQueue.length > 2){
			let firstElement = userQueue.shift();
			userQueue[userQueue.length] = firstElement;
		}
		if(socket.id != userQueue[0] || socket.id != userQueue[1]){
			let index = 1;
			for(i of userQueue){
				io.to(i).emit("updatePlayerNumbers", index);
				index++;
			}
		}
		io.emit("reset");
		if(connectCounter == 2){
			startGame();
		}
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

	socket.on("gameover", async (color) => {
		gameover = true;
		if(color == "tie"){
			io.emit("globalGameover", "Tie!");
		}
		else{
			io.emit("globalGameover", color);
		}
		//io.emit(next game will begin shortly)
		if(userQueue.length > 2){
			let firstElement = userQueue.shift();
			userQueue[userQueue.length] = firstElement;
		}
		let index = 1;
		for(i of userQueue){
			io.to(i).emit("updatePlayerNumbers", index);
			index++;
		}
		await sleep(5000);
		io.emit("reset");
		startGame();
	});
	
	let userIndex = userQueue.indexOf(socket.id);
	userList[socket.id].playerNumber = userIndex + 1;
	socket.emit("sendName", userList[socket.id]);
	if(connectCounter == 2 ){
		startGame();
	}

});

function startGame() {
	//Board is cleared
	io.emit("clearBoard");
	io.emit("disableButtons");
	//Player one starts
	playerOne = userList[userQueue[0]];
	playerTwo = userList[userQueue[1]];
	playerOneTurn();
}

function playerOneTurn() {
	//io.emit to tell who's turn it is
	//let one = "one"
	//playerOne.playerNumber = 1;
	io.emit("whosTurnIsIt", playerOne);
	//update board when button is pressed
	//if won then gameover
	if(gameover){
		//do something
	}
	//else pass to player two
}

function playerTwoTurn() {
	//playerTwo.playerNumber = 2;
	io.emit("whosTurnIsIt", playerTwo);
	//update board when button is pressed
	//if won then gameover
	if(gameover){
		//do something
	}
	//else pass to player two
}



server.listen(31415, function() {
	console.log("Server with socket.io is ready.");
});


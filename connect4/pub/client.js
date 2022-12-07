let socket = io();

let myApp = Vue.createApp({
	data() {
		return {
			grid: [
				{id: 1, color: "null", row: 6, full: false}, {id: 2, color: "null", row: 6, full: false}, {id: 3, color: "null", row: 6, full: false}, {id: 4, color: "null", row: 6, full: false}, {id: 5, color: "null", row: 6, full: false}, {id: 6, color: "null", row: 6, full: false}, {id: 7, color: "null", row: 6, full: false},
				{id: 8, color: "null", row: 5}, {id: 9, color: "null", row: 5}, {id: 10, color: "null", row: 5}, {id: 11, color: "null", row: 5}, {id: 12, color: "null", row: 5}, {id: 13, color: "null", row: 5}, {id: 14, color: "null", row: 5},
				{id: 15, color: "null", row: 4}, {id: 16, color: "null", row: 4}, {id: 17, color: "null", row: 4}, {id: 18, color: "null", row: 4}, {id: 19, color: "null", row: 4}, {id: 21, color: "null", row: 4}, {id: 21, color: "null", row: 4},
				{id: 22, color: "null", row: 3}, {id: 23, color: "null", row: 3}, {id: 24, color: "null", row: 3}, {id: 25, color: "null", row: 3}, {id: 26, color: "null", row: 3}, {id: 27, color: "null", row: 3}, {id: 28, color: "null", row: 3},
				{id: 29, color: "null", row: 2}, {id: 30, color: "null", row: 2}, {id: 31, color: "null", row: 2}, {id: 32, color: "null", row: 2}, {id: 33, color: "null", row: 2}, {id: 34, color: "null", row: 2}, {id: 35, color: "null", row: 2},
				{id: 36, color: "null", row: 1}, {id: 37, color: "null", row: 1}, {id: 38, color: "null", row: 1}, {id: 39, color: "null", row: 1}, {id: 40, color: "null", row: 1}, {id: 41, color: "null", row: 1}, {id: 42, color: "null", row: 1}
			],
			gameStatus: "Waiting on player to join...",
			userList: null,
			username: null,
			playerNumber: null,
			winner: false,
			currentPlayerName: null,
			currentPlayerNumber: 0,
			tie: false
        };
	},
	methods: {
        addChip(column) {
			let bottomId = this.findBottomId(column);
			while(this.grid[bottomId - 1].color != "null"){
				bottomId -= 7;
				if(bottomId < 1){
					console.log("Row is full!");
					return;
				}
			}
			this.grid[bottomId - 1].full = true;
			if(this.currentPlayerNumber == 1){
				socket.emit("addChip", bottomId, "black");
				//check for black win
				this.hasWon("black", bottomId);
				if(this.winner == true){
					socket.emit("gameover", "black");
				}
				this.checkForTie();
				if(this.tie == true){
					socket.emit("gameover", "tie");
				}
			}
			else{
				socket.emit("addChip", bottomId, "red");
				//check for red win
				this.hasWon("red", bottomId);
				if(this.winner == true){
					socket.emit("gameover", "red");
				}
				this.checkForTie();
				if(this.tie == true){
					socket.emit("gameover", "tie");
				}
			}
			//this.grid[bottomId - 1].color = "black";
		},
		findBottomId(column) {
			return column + (7 * 5);
		},
		checkForColor(color) {
			if (color == 'black') {
                return 2;
            }
            else if(color == 'red') {
                return 1;
            }
            else{
                return 0;
            }
		},
		hasWon(color, bottomId) {
			let startRow = this.grid[bottomId - 1].row;
			this.checkRightAndLeft(color, bottomId, startRow);
			this.checkDown(color, bottomId);
			this.checkBottomLeftToTopRight(color, bottomId);
			this.checkTopLeftToBottomRight(color, bottomId);
			
		},
		checkRightAndLeft(color, bottomId, startRow){
			let horizontalTotal = 1;
			try{
				for(let i = 0; i < 3; ++i){
					if(this.grid[bottomId + i].row == startRow && this.grid[bottomId + i].color == color){
						horizontalTotal++;
					}
					else{
						break;
					}
					if(horizontalTotal == 4){
						this.winner = true;
						break;
					}
				}
			}
			catch(e){
				console.log(e);
			}
			try{
				for(let i = 2; i < 5; ++i){
					if(this.grid[bottomId - i].color == color && this.grid[bottomId - i].row == startRow){
						horizontalTotal++;
					}
					else{
						break;
					}
					if(horizontalTotal == 4){
						this.winner = true;
						break;
					}
				}
			}
			catch(e){
				console.log(e);
			}
		},
		checkDown(color, bottomId) {
			let verticalTotal = 1;
			try{
				for(let i = 6; i < 42; i += 7){
					if(this.grid[bottomId + i].color == color && this.grid[bottomId + i].row > 0){
						verticalTotal++;
					}
					else{
						break;
					}
					if(verticalTotal == 4){
						this.winner = true;
						break;
					}
				}
			}
			catch(e){
				console.log(e);
			}
		},
		checkBottomLeftToTopRight(color, bottomId) {
			let bottomLeftToTopRightTotal = 1;
			try{
				for(let i = 5; i < 42; i += 6){
					//check bottom left
					if(this.grid[bottomId + i].color == color && this.grid[bottomId + i].row > 0){
						bottomLeftToTopRightTotal++;
					}
					else{
						break;
					}
					if(bottomLeftToTopRightTotal == 4){
						this.winner = true;
						break;
					}
				}
			}
			catch(e){
				console.log(e);
			}
			try{
				for(let i = 7; i < 42; i += 6){
					//check top right
					if(this.grid[bottomId - i].color == color && this.grid[bottomId - i].row < 7){
						bottomLeftToTopRightTotal++;
					}
					else{
						break;
					}
					if(bottomLeftToTopRightTotal == 4){
						this.winner = true;
						break;
					}
				}
			}
			catch(e){
				console.log(e);
			}
		},
		checkTopLeftToBottomRight(color, bottomId) {
			let topLeftToBottomRightTotal = 1;
			try{
				for(let i = 9; i < 42; i += 8){
					//check top left
					if(this.grid[bottomId - i].color == color && this.grid[bottomId - i].row < 7){
						topLeftToBottomRightTotal++;
					}
					else{
						break;
					}
					if(topLeftToBottomRightTotal == 4){
						this.winner = true;
						break;
					}
				}
			}
			catch(e){
				console.log(e);
			}
			try{
				for(let i = 7; i < 42; i += 8){
					//check bottom right
					if(this.grid[bottomId + i].color == color && this.grid[bottomId + i].row > 0){
						topLeftToBottomRightTotal++;
					}
					else{
						break;
					}
					if(topLeftToBottomRightTotal == 4){
						this.winner = true;
						break;
					}
				}
			}
			catch(e){
				console.log(e);
			}
		},
		checkForTie() {
			let topRowCount = 0;
			for(let i = 0; i < 7; ++i){
				if(this.grid[i].full == true){
					++topRowCount;
				}
				else{
					break;
				}
			}
			if(topRowCount == 7){
				this.tie = true;
			}
		},
		checkIfCurrentPlayer() {
			if(this.currentPlayerNumber == this.playerNumber){
				document.getElementById("button1").disabled = false;
				document.getElementById("button2").disabled = false;
				document.getElementById("button3").disabled = false;
				document.getElementById("button4").disabled = false;
				document.getElementById("button5").disabled = false;
				document.getElementById("button6").disabled = false;
				document.getElementById("button7").disabled = false;
			}
			if(this.currentPlayerNumber != this.playerNumber){
				document.getElementById("button1").disabled = true;
				document.getElementById("button2").disabled = true;
				document.getElementById("button3").disabled = true;
				document.getElementById("button4").disabled = true;
				document.getElementById("button5").disabled = true;
				document.getElementById("button6").disabled = true;
				document.getElementById("button7").disabled = true;
			}
		}
    },
	computed: {
		
	},
	mounted() {
        socket.on("sendName", (playerInfo) => {
			this.username = playerInfo.username;
			this.playerNumber = playerInfo.playerNumber
		});
		socket.on("clearBoard", () => {
			for(let i = 0; i < 42; ++i) {
				this.grid[i].color = "null";
			}
			for(let i = 0; i < 7; ++i){
				this.grid[i].full = false;
			}
		});
		socket.on("whosTurnIsIt", (playerName) => {
			if(this.winner == false){
				this.gameStatus = "It is currently " + playerName.username + "'s turn" + " # " + playerName.playerNumber;
				this.currentPlayerName = playerName.username;
				this.currentPlayerNumber = playerName.playerNumber;
				this.checkIfCurrentPlayer();
			}
		});
		socket.on("sendBottomId", (bottomIdFromServer, colorFromServer) => {
			this.grid[bottomIdFromServer - 1].color = colorFromServer;
		});
		socket.on("globalGameover", (color) => {
			if(this.tie == true){
				this.gameStatus = color;
			}
			else if(color == "black" || color == "red"){
				this.gameStatus = color + " won!";
			}
			else{
				this.gameStatus = color;
			}
		});
		socket.on("disableButtons", () => {
			this.checkIfCurrentPlayer();
		})
		socket.on("reset", () => {
			this.userList = null;
			//this.username = null;
			//this.playerNumber = 0;
			this.winner = false;
			this.currentPlayerName = null;
			this.currentPlayerNumber = 0;
			this.tie = false;
		});
		socket.on("updatePlayerNumbers", (newPlayerNumber) => {
			this.playerNumber = newPlayerNumber;
		});
    }
}).mount("#app");
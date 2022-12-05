let socket = io();

socket.on("sayBack", function(dataFromServer) {
	console.log("The server said: " + dataFromServer);
});

socket.emit("saySomething", "Hello");


let myApp = Vue.createApp({
	data() {
		return {
			grid: [
				{id: 1, color: "null", row: 6}, {id: 2, color: "null", row: 6}, {id: 3, color: "null", row: 6}, {id: 4, color: "null", row: 6}, {id: 5, color: "null", row: 6}, {id: 6, color: "null", row: 6}, {id: 7, color: "null", row: 6},
				{id: 8, color: "null", row: 5}, {id: 9, color: "null", row: 5}, {id: 10, color: "null", row: 5}, {id: 11, color: "null", row: 5}, {id: 12, color: "null", row: 5}, {id: 13, color: "null", row: 5}, {id: 14, color: "null", row: 5},
				{id: 15, color: "null", row: 4}, {id: 16, color: "null", row: 4}, {id: 17, color: "null", row: 4}, {id: 18, color: "null", row: 4}, {id: 19, color: "null", row: 4}, {id: 21, color: "null", row: 4}, {id: 21, color: "null", row: 4},
				{id: 22, color: "null", row: 3}, {id: 23, color: "null", row: 3}, {id: 24, color: "null", row: 3}, {id: 25, color: "null", row: 3}, {id: 26, color: "null", row: 3}, {id: 27, color: "null", row: 3}, {id: 28, color: "null", row: 3},
				{id: 29, color: "null", row: 2}, {id: 30, color: "null", row: 2}, {id: 31, color: "null", row: 2}, {id: 32, color: "null", row: 2}, {id: 33, color: "null", row: 2}, {id: 34, color: "null", row: 2}, {id: 35, color: "null", row: 2},
				{id: 36, color: "null", row: 1}, {id: 37, color: "null", row: 1}, {id: 38, color: "null", row: 1}, {id: 39, color: "null", row: 1}, {id: 40, color: "null", row: 1}, {id: 41, color: "null", row: 1}, {id: 42, color: "null", row: 1}
			],
			gameStatus: "Waiting on player to join...",
			userList: null,
			username: null,
			winner: false,
			currentPlayerName: null,
			currentPlayerNumber: 0
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
			if(this.currentPlayerNumber == 1){
				socket.emit("addChip", bottomId, "black");
				//check for black win
				this.hasWon("black", bottomId);
				if(this.winner == true){
					socket.emit("gameover", "black");
				}
			}
			else{
				socket.emit("addChip", bottomId, "red");
				//check for red win
				this.hasWon("red", bottomId);
				if(this.winner == true){
					socket.emit("gameover", "red");
				}
			}
			this.grid[bottomId - 1].color = "black";
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
			//let startId = this.grid[bottomId - 1].id;
			let startRow = this.grid[bottomId - 1].row;
			let horizontalTotal = 1;
			let verticalTotal = 1;
			try{
				for(let i = 0; i < 3; ++i){
					//check right
					if(this.grid[bottomId + i].row == startRow && this.grid[bottomId + i].color == color){
						horizontalTotal++;
					}
					else{
						break;
					}
					if(horizontalTotal == 4){
						this.winner = true;
					}
				}
			}
			catch(e){
				console.log(e);
			}
			try{
				for(let i = 2; i < 5; ++i){
					//check left
					if(this.grid[bottomId - i].color == color && this.grid[bottomId - i].row == startRow){
						horizontalTotal++;
					}
					else{
						break;
					}
					if(horizontalTotal == 4){
						this.winner = true;
					}
				}
			}
			catch(e){
				console.log(e);
			}
			try{
				for(let i = 0; i < 3; ++i){
					//check up
					if(this.grid[bottomId + i].color == color && this.grid[bottomId - i].row > 0){
						verticalTotal++;
					}
					else{
						break;
					}
					if(verticalTotal == 4){
						this.winner = true;
					}
				}
			}
			catch(e){
				console.log(e);
			}
		}
    },
	computed: {
		
	},
	mounted() {
        socket.on("sendName", (dataFromServer) => {
			this.username = dataFromServer;
		});
		socket.on("clearBoard", () => {
			for(let i = 0; i < 42; ++i) {
				this.grid[i].color = "null";
			}
		});
		socket.on("whosTurnIsIt", (playerName/*, playerNumber*/) => {
			this.currentPlayerName = playerName.username;
			this.currentPlayerNumber = playerName.playerNumber;
		});
		socket.on("sendBottomId", (bottomIdFromServer, colorFromServer) => {
			this.grid[bottomIdFromServer - 1].color = colorFromServer;
		});
		socket.on("globalGameover", (color) => {
			this.gameStatus = color + " won!";
		});
    }
}).mount("#app");
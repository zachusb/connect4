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
			]
        };
	},
	methods: {
        addChip(column) {
			let bottomId = this.findBottomId(column);
			while(this.grid[bottomId - 1].color != "null"){
				bottomId -= 7;
				if(bottomId < 1){
					console.log("Row is full!");
					break;
				}
			}
			this.grid[bottomId - 1].color = "black";
		},
		findBottomId(column) {
			return column + (7 * 5);
		},  
    },
	computed: {

	},
	mounted() {
        
    }
}).mount("#app");
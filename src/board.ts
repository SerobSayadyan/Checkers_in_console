export class Board {
	private white = "●";
	private black = "O";

	private whosTurn = this.white;

	private board: string[][] = [
		[" ", "O", " ", "O", " ", "O", " ", "O"],
		["O", " ", "O", " ", "O", " ", "O", " "],
		[" ", "O", " ", "O", " ", "O", " ", "O"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["●", " ", "●", " ", "●", " ", "●", " "],
		[" ", "●", " ", "●", " ", "●", " ", "●"],
		["●", " ", "●", " ", "●", " ", "●", " "],
	];

	private positionConstantsForWhitess: { [key: string]: number } = {
		H: 0,
		G: 1,
		F: 2,
		E: 3,
		D: 4,
		C: 5,
		B: 6,
		A: 7,

		"1": 0,
		"2": 1,
		"3": 2,
		"4": 3,
		"5": 4,
		"6": 5,
		"7": 6,
		"8": 7,
	};

    private positionConstantsForBlacks: { [key: string]: number } = {
		H: 7,
		G: 6,
		F: 5,
		E: 4,
		D: 3,
		C: 2,
		B: 1,
		A: 0,

		"1": 7,
		"2": 6,
		"3": 5,
		"4": 4,
		"5": 3,
		"6": 2,
		"7": 1,
		"8": 0,
	};

	readonly whiteScore: string[] = [];
	readonly blackScore: string[] = [];

	rotateBoard(): void {
		const length = this.board.length;
		for (let row = 0; row < length / 2; row++) {
			for (let column = 0; column < length; column++) {
				let tmp = this.board[row][column];
				this.board[row][column] = this.board[length - row - 1][length - column - 1];
				this.board[length - row - 1][length - column - 1] = tmp;
			}
		}

		this.whosTurn = this.whosTurn === this.black ? this.white : this.black;
	}

	right(row: string, column: string): boolean {
        const isWhitesTurn = this.whosTurn === this.white;

		const rowIndex = isWhitesTurn ? this.positionConstantsForWhitess[row] : this.positionConstantsForBlacks[row];
		const columnIndex = isWhitesTurn ? this.positionConstantsForWhitess[column] : this.positionConstantsForBlacks[column];

		if (rowIndex === 0 || columnIndex === this.board.length - 1) {
			return false;
		}

		if (this.board[rowIndex][columnIndex] !== this.whosTurn) {
			return false;
		}

		if (this.board[rowIndex - 1][columnIndex + 1] === this.whosTurn) {
			return false;
		}

		if (
			this.board[rowIndex - 1][columnIndex + 1] ===
			(this.whosTurn === this.black ? this.white : this.black)
		) {
			if (
				rowIndex - 2 < 0 ||
				columnIndex + 2 >= this.board.length ||
				this.board[rowIndex - 2][columnIndex + 2] !== " "
			) {
				return false;
			}
			this.board[rowIndex][columnIndex] = " ";
			this.board[rowIndex - 1][columnIndex + 1] = " ";
			this.board[rowIndex - 2][columnIndex + 2] = this.whosTurn;

			//addScore
			if (this.whosTurn === this.white) {
				this.whiteScore.push(this.black);
			} else {
				this.blackScore.push(this.white);
			}

			return true;
		}

		const figure = this.board[rowIndex][columnIndex];
		this.board[rowIndex][columnIndex] = " ";

		this.board[rowIndex - 1][columnIndex + 1] = figure;

		return true;
	}

	rightDown(row: string, column: string): boolean {
		const isWhitesTurn = this.whosTurn === this.white;

		const rowIndex = isWhitesTurn ? this.positionConstantsForWhitess[row] : this.positionConstantsForBlacks[row];
		const columnIndex = isWhitesTurn ? this.positionConstantsForWhitess[column] : this.positionConstantsForBlacks[column];

		if (rowIndex === this.board.length - 1 || columnIndex === this.board.length - 1) {
			return false;
		}

		if (this.board[rowIndex][columnIndex] !== this.whosTurn) {
			return false;
		}

		if (this.board[rowIndex + 1][columnIndex + 1] === this.whosTurn) {
			return false;
		}

		if (
			this.board[rowIndex + 1][columnIndex + 1] ===
			(this.whosTurn === this.black ? this.white : this.black)
		) {
			if (
				rowIndex + 2 >= this.board.length ||
				columnIndex + 2 >= this.board.length ||
				this.board[rowIndex + 2][columnIndex + 2] !== " "
			) {
				return false;
			}
			this.board[rowIndex][columnIndex] = " ";
			this.board[rowIndex + 1][columnIndex + 1] = " ";
			this.board[rowIndex + 2][columnIndex + 2] = this.whosTurn;

			//addScore
			if (this.whosTurn === this.white) {
				this.whiteScore.push(this.black);
			} else {
				this.blackScore.push(this.white);
			}

			return true;
		}

		return false;
	}

	left(row: string, column: string): boolean {
		const isWhitesTurn = this.whosTurn === this.white;

		const rowIndex = isWhitesTurn ? this.positionConstantsForWhitess[row] : this.positionConstantsForBlacks[row];
		const columnIndex = isWhitesTurn ? this.positionConstantsForWhitess[column] : this.positionConstantsForBlacks[column];

		if (rowIndex === 0 || columnIndex === 0) {
			return false;
		}

		if (this.board[rowIndex][columnIndex] !== this.whosTurn) {
			return false;
		}

		if (this.board[rowIndex - 1][columnIndex - 1] === this.whosTurn) {
			return false;
		}

		if (
			this.board[rowIndex - 1][columnIndex - 1] ===
			(this.whosTurn === this.black ? this.white : this.black)
		) {
			if (
				rowIndex - 2 < 0 ||
				columnIndex - 2 <= 0 ||
				this.board[rowIndex - 2][columnIndex - 2] !== " "
			) {
				return false;
			}
			this.board[rowIndex][columnIndex] = " ";
			this.board[rowIndex - 1][columnIndex - 1] = " ";
			this.board[rowIndex - 2][columnIndex - 2] = this.whosTurn;

			//addScore
			if (this.whosTurn === this.white) {
				this.whiteScore.push(this.black);
			} else {
				this.blackScore.push(this.white);
			}

			return true;
		}

		const figure = this.board[rowIndex][columnIndex];
		this.board[rowIndex][columnIndex] = " ";

		this.board[rowIndex - 1][columnIndex - 1] = figure;

		return true;
	}

	leftDown(row: string, column: string): boolean {
		const isWhitesTurn = this.whosTurn === this.white;

		const rowIndex = isWhitesTurn ? this.positionConstantsForWhitess[row] : this.positionConstantsForBlacks[row];
		const columnIndex = isWhitesTurn ? this.positionConstantsForWhitess[column] : this.positionConstantsForBlacks[column];

		if (rowIndex === this.board.length - 1 || columnIndex === 0) {
			return false;
		}

		if (this.board[rowIndex][columnIndex] !== this.whosTurn) {
			return false;
		}

		if (this.board[rowIndex + 1][columnIndex - 1] === this.whosTurn) {
			return false;
		}

		if (
			this.board[rowIndex + 1][columnIndex - 1] ===
			(this.whosTurn === this.black ? this.white : this.black)
		) {
			if (
				rowIndex + 2 >= this.board.length ||
				columnIndex - 2 < 0 ||
				this.board[rowIndex + 2][columnIndex - 2] !== " "
			) {
				return false;
			}
			this.board[rowIndex][columnIndex] = " ";
			this.board[rowIndex + 1][columnIndex - 1] = " ";
			this.board[rowIndex + 2][columnIndex - 2] = this.whosTurn;

			//addScore
			if (this.whosTurn === this.white) {
				this.whiteScore.push(this.black);
			} else {
				this.blackScore.push(this.white);
			}

			return true;
		}

		return false;
	}

	toString(): string {
		let str: string = "";
		const alphabet: string[] = ["H", "G", "F", "E", "D", "C", "B", "A"];
		let alphabetIndex = 0;

		str = str.concat(`${this.whosTurn === this.black ? "\tBlacks turn" : "\tWhites turn"}\n`);

        const isBlacksTurn = this.whosTurn === this.black;
		if (isBlacksTurn) {
			alphabetIndex = this.board.length - 1;
		}
		for (let row = 0; row < this.board.length; row++) {
			for (let column = -1; column < this.board.length; column++) {
				if (column === -1) {

					str = str.concat(`${alphabet[isBlacksTurn ? alphabetIndex-- : alphabetIndex++]}`);
				} else {
					str = str.concat(`[${this.board[row][column]}]`);
				}
			}

			str = str.concat("\n");
		}
        
		str = str.concat(isBlacksTurn ? "  8  7  6  5  4  3  2  1 " : "  1  2  3  4  5  6  7  8 ");

		str = str.concat("\n");
		str = str.concat("Whites: ");
		this.whiteScore.forEach((x) => {
			str = str.concat(`${x} `);
		});

		str = str.concat("\n");
		str = str.concat("Blacks: ");
		this.blackScore.forEach((x) => {
			str = str.concat(`${x} `);
		});

		return str;
	}

	displayWinner(): boolean {
		if (this.whiteScore.length === 12) {
			console.log("Whites Wins!!!");
			process.exit(0);
		} else if (this.blackScore.length === 12) {
			console.log("Blacks Wins!!!");
			process.exit(0);
		}
		return true;
	}

	display(): void {
		console.log(this.toString());
	}
}

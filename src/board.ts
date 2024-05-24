import { BoardAndMovesHistory, BoardHistory } from "./boardAndMovesHistory";

export class Board {
	private readonly white = "●";
	private readonly black = "○";
	private readonly whiteQueen = "⛃";
	private readonly blackQueen = "⛁";
	private readonly space = " ";

	private whosTurn = this.white;

	private board: string[][] = [
		[
			this.space,
			this.black,
			this.space,
			this.black,
			this.space,
			this.black,
			this.space,
			this.black,
		],
		[
			this.black,
			this.space,
			this.black,
			this.space,
			this.black,
			this.space,
			this.black,
			this.space,
		],
		[
			this.space,
			this.black,
			this.space,
			this.black,
			this.space,
			this.black,
			this.space,
			this.black,
		],
		[
			this.space,
			this.space,
			this.space,
			this.space,
			this.space,
			this.space,
			this.space,
			this.space,
		],
		[
			this.space,
			this.space,
			this.space,
			this.space,
			this.space,
			this.space,
			this.space,
			this.space,
		],
		[
			this.white,
			this.space,
			this.white,
			this.space,
			this.white,
			this.space,
			this.white,
			this.space,
		],
		[
			this.space,
			this.white,
			this.space,
			this.white,
			this.space,
			this.white,
			this.space,
			this.white,
		],
		[
			this.white,
			this.space,
			this.white,
			this.space,
			this.white,
			this.space,
			this.white,
			this.space,
		],
	];

	private readonly positionConstantsForWhitess: { [key: string]: number } = {
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

	private readonly positionConstantsForBlacks: { [key: string]: number } = {
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

	whiteScore: string[] = [];
	blackScore: string[] = [];

	private readonly history: BoardAndMovesHistory = new BoardAndMovesHistory();

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

	right(row: string, column: string): { everythingOk: boolean; hasOneMoreStep: boolean } {
		const isWhitesTurn = this.whosTurn === this.white;

		const rowIndex = isWhitesTurn
			? this.positionConstantsForWhitess[row]
			: this.positionConstantsForBlacks[row];
		const columnIndex = isWhitesTurn
			? this.positionConstantsForWhitess[column]
			: this.positionConstantsForBlacks[column];

		if (rowIndex === 0 || columnIndex === this.board.length - 1) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		if (this.board[rowIndex][columnIndex] !== this.whosTurn) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		if (this.board[rowIndex - 1][columnIndex + 1] === this.whosTurn) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		let opponentFigure = this.whosTurn === this.black ? this.white : this.black;
		let opponentQueen;

		if (
			this.board[rowIndex - 1][columnIndex + 1] === opponentFigure ||
			this.board[rowIndex - 1][columnIndex + 1] ===
				(opponentQueen = this.whosTurn === this.black ? this.whiteQueen : this.blackQueen)
		) {
			if (
				rowIndex - 2 < 0 ||
				columnIndex + 2 >= this.board.length ||
				this.board[rowIndex - 2][columnIndex + 2] !== this.space
			) {
				return { everythingOk: false, hasOneMoreStep: false };
			}
			this.board[rowIndex][columnIndex] = this.space;
			this.board[rowIndex - 1][columnIndex + 1] = this.space;
			this.board[rowIndex - 2][columnIndex + 2] = this.whosTurn;

			//if figure is in the front edge of the board it becomes queen
			this.becomeQueen(rowIndex - 2, columnIndex + 2);

			//addScore
			this.addScore(opponentQueen ? opponentQueen : opponentFigure);

			//if figure is in the front edge of the board it becomes queen
			this.becomeQueen(rowIndex - 2, columnIndex + 2);

			if (this.hasOneMoreStep(rowIndex - 2, columnIndex + 2)) {
				return { everythingOk: true, hasOneMoreStep: true };
			}
			return { everythingOk: true, hasOneMoreStep: false };
		}

		const figure = this.board[rowIndex][columnIndex];
		this.board[rowIndex][columnIndex] = this.space;

		this.board[rowIndex - 1][columnIndex + 1] = figure;

		//if figure is in the front edge of the board it becomes queen
		this.becomeQueen(rowIndex - 1, columnIndex + 1);

		return { everythingOk: true, hasOneMoreStep: false };
	}

	rightDown(row: string, column: string): { everythingOk: boolean; hasOneMoreStep: boolean } {
		const isWhitesTurn = this.whosTurn === this.white;

		const rowIndex = isWhitesTurn
			? this.positionConstantsForWhitess[row]
			: this.positionConstantsForBlacks[row];
		const columnIndex = isWhitesTurn
			? this.positionConstantsForWhitess[column]
			: this.positionConstantsForBlacks[column];

		if (rowIndex === this.board.length - 1 || columnIndex === this.board.length - 1) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		if (this.board[rowIndex][columnIndex] !== this.whosTurn) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		if (this.board[rowIndex + 1][columnIndex + 1] === this.whosTurn) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		let opponentFigure = this.whosTurn === this.black ? this.white : this.black;
		let opponentQueen;

		if (
			this.board[rowIndex + 1][columnIndex + 1] === opponentFigure ||
			this.board[rowIndex + 1][columnIndex + 1] ===
				(opponentQueen = this.whosTurn === this.black ? this.whiteQueen : this.blackQueen)
		) {
			if (
				rowIndex + 2 >= this.board.length ||
				columnIndex + 2 >= this.board.length ||
				this.board[rowIndex + 2][columnIndex + 2] !== this.space
			) {
				return { everythingOk: false, hasOneMoreStep: false };
			}
			this.board[rowIndex][columnIndex] = this.space;
			this.board[rowIndex + 1][columnIndex + 1] = this.space;
			this.board[rowIndex + 2][columnIndex + 2] = this.whosTurn;

			//if figure is in the front edge of the board it becomes queen
			this.becomeQueen(rowIndex + 2, columnIndex + 2);

			//addScore
			this.addScore(opponentQueen ? opponentQueen : opponentFigure);

			//if figure is in the front edge of the board it becomes queen
			this.becomeQueen(rowIndex + 2, columnIndex + 2);

			if (this.hasOneMoreStep(rowIndex + 2, columnIndex + 2)) {
				return { everythingOk: true, hasOneMoreStep: true };
			}
			return { everythingOk: true, hasOneMoreStep: false };
		}

		return { everythingOk: false, hasOneMoreStep: false };
	}

	left(row: string, column: string): { everythingOk: boolean; hasOneMoreStep: boolean } {
		const isWhitesTurn = this.whosTurn === this.white;

		const rowIndex = isWhitesTurn
			? this.positionConstantsForWhitess[row]
			: this.positionConstantsForBlacks[row];
		const columnIndex = isWhitesTurn
			? this.positionConstantsForWhitess[column]
			: this.positionConstantsForBlacks[column];

		if (rowIndex === 0 || columnIndex === 0) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		if (this.board[rowIndex][columnIndex] !== this.whosTurn) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		if (this.board[rowIndex - 1][columnIndex - 1] === this.whosTurn) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		let opponentFigure = this.whosTurn === this.black ? this.white : this.black;
		let opponentQueen;

		if (
			this.board[rowIndex - 1][columnIndex - 1] === opponentFigure ||
			this.board[rowIndex - 1][columnIndex - 1] ===
				(opponentQueen = this.whosTurn === this.black ? this.whiteQueen : this.blackQueen)
		) {
			if (
				rowIndex - 2 < 0 ||
				columnIndex - 2 < 0 ||
				this.board[rowIndex - 2][columnIndex - 2] !== this.space
			) {
				return { everythingOk: false, hasOneMoreStep: false };
			}
			this.board[rowIndex][columnIndex] = this.space;
			this.board[rowIndex - 1][columnIndex - 1] = this.space;
			this.board[rowIndex - 2][columnIndex - 2] = this.whosTurn;

			//if figure is in the front edge of the board it becomes queen
			this.becomeQueen(rowIndex - 2, columnIndex - 2);

			//addScore
			this.addScore(opponentQueen ? opponentQueen : opponentFigure);

			if (this.hasOneMoreStep(rowIndex - 2, columnIndex - 2)) {
				return { everythingOk: true, hasOneMoreStep: true };
			}
			return { everythingOk: true, hasOneMoreStep: false };
		}

		const figure = this.board[rowIndex][columnIndex];
		this.board[rowIndex][columnIndex] = this.space;

		this.board[rowIndex - 1][columnIndex - 1] = figure;

		//if figure is in the front edge of the board it becomes queen
		this.becomeQueen(rowIndex - 1, columnIndex - 1);
		return { everythingOk: true, hasOneMoreStep: false };
	}

	leftDown(row: string, column: string): { everythingOk: boolean; hasOneMoreStep: boolean } {
		const isWhitesTurn = this.whosTurn === this.white;

		const rowIndex = isWhitesTurn
			? this.positionConstantsForWhitess[row]
			: this.positionConstantsForBlacks[row];
		const columnIndex = isWhitesTurn
			? this.positionConstantsForWhitess[column]
			: this.positionConstantsForBlacks[column];

		if (rowIndex === this.board.length - 1 || columnIndex === 0) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		if (this.board[rowIndex][columnIndex] !== this.whosTurn) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		if (this.board[rowIndex + 1][columnIndex - 1] === this.whosTurn) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		let opponentFigure = this.whosTurn === this.black ? this.white : this.black;
		let opponentQueen;

		if (
			this.board[rowIndex + 1][columnIndex - 1] === opponentFigure ||
			this.board[rowIndex + 1][columnIndex - 1] ===
				(opponentQueen = this.whosTurn === this.black ? this.whiteQueen : this.blackQueen)
		) {
			if (
				rowIndex + 2 >= this.board.length ||
				columnIndex - 2 < 0 ||
				this.board[rowIndex + 2][columnIndex - 2] !== this.space
			) {
				return { everythingOk: false, hasOneMoreStep: false };
			}
			this.board[rowIndex][columnIndex] = this.space;
			this.board[rowIndex + 1][columnIndex - 1] = this.space;
			this.board[rowIndex + 2][columnIndex - 2] = this.whosTurn;

			//if figure is in the front edge of the board it becomes queen
			this.becomeQueen(rowIndex + 2, columnIndex - 2);

			//addScore
			this.addScore(opponentQueen ? opponentQueen : opponentFigure);

			if (this.hasOneMoreStep(rowIndex + 2, columnIndex - 2)) {
				return { everythingOk: true, hasOneMoreStep: true };
			}
			return { everythingOk: true, hasOneMoreStep: false };
		}

		return { everythingOk: false, hasOneMoreStep: false };
	}

	queenMove(
		fromRow: string,
		fromColumn: string,
		toRow: string,
		toColumn: string
	): { everythingOk: boolean; hasOneMoreStep: boolean } {
		const isWhitesTurn = this.whosTurn === this.white;
		const queenFigure = isWhitesTurn ? this.whiteQueen : this.blackQueen;

		const opponentFigure = isWhitesTurn ? this.black : this.white;
		const opponentQueen = isWhitesTurn ? this.blackQueen : this.whiteQueen;

		const fromRowIndex = isWhitesTurn
			? this.positionConstantsForWhitess[fromRow]
			: this.positionConstantsForBlacks[fromRow];
		const fromColumnIndex = isWhitesTurn
			? this.positionConstantsForWhitess[fromColumn]
			: this.positionConstantsForBlacks[fromColumn];

		const toRowIndex = isWhitesTurn
			? this.positionConstantsForWhitess[toRow]
			: this.positionConstantsForBlacks[toRow];
		const toColumnIndex = isWhitesTurn
			? this.positionConstantsForWhitess[toColumn]
			: this.positionConstantsForBlacks[toColumn];

		if (
			toColumnIndex < 0 ||
			toColumnIndex >= this.board.length ||
			toRowIndex < 0 ||
			toRowIndex >= this.board.length
		) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		if (fromColumnIndex === toColumnIndex || fromRowIndex === toRowIndex) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		if (Math.abs(fromColumnIndex - toColumnIndex) !== Math.abs(fromRowIndex - toRowIndex)) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		if (this.board[fromRowIndex][fromColumnIndex] !== queenFigure) {
			return { everythingOk: false, hasOneMoreStep: false };
		}

		//making a move
		let indexRow = 0;
		let indexColumn = 0;
		let eatableOpponent: string = "";
		let doesQueenAteSomeone = false;

		if (fromRowIndex < toRowIndex) {
			indexRow = fromRowIndex + 1;
			if (fromColumnIndex < toColumnIndex) {
				//Down Right
				for (
					indexColumn = fromColumnIndex + 1;
					indexColumn <= toColumnIndex && indexRow <= toRowIndex;
					indexColumn++
				) {
					if (
						this.board[indexRow][indexColumn] === (eatableOpponent = opponentFigure) ||
						this.board[indexRow][indexColumn] === (eatableOpponent = opponentQueen)
					) {
						//eat
						if (indexRow + 1 < this.board.length && indexColumn + 1 < this.board.length) {
							if (this.board[indexRow + 1][indexColumn + 1] === this.space) {
								this.addScore(eatableOpponent);

								//remove opponents figure
								this.board[indexRow][indexColumn] = this.space;
								//remove my figure from its previous place
								this.board[indexRow - 1][indexColumn - 1] = this.space;
								//place it one step over opponents figure
								this.board[indexRow + 1][indexColumn + 1] = queenFigure;
								++indexRow;
								++indexColumn;
								doesQueenAteSomeone = true;
							}
						}
					} else if (this.board[indexRow][indexColumn] !== this.space) {
						return { everythingOk: false, hasOneMoreStep: false };
					} else {
						this.board[indexRow - 1][indexColumn - 1] = this.space;
						this.board[indexRow][indexColumn] = queenFigure;
					}

					indexRow++;
				}
			} else {
				//Down Left
				for (
					indexColumn = fromColumnIndex - 1;
					indexColumn >= toColumnIndex && indexRow <= toRowIndex;
					indexColumn--
				) {
					if (
						this.board[indexRow][indexColumn] === (eatableOpponent = opponentFigure) ||
						this.board[indexRow][indexColumn] === (eatableOpponent = opponentQueen)
					) {
						//eat
						if (indexRow + 1 < this.board.length && indexColumn - 1 >= 0) {
							if (this.board[indexRow + 1][indexColumn - 1] === this.space) {
								this.addScore(eatableOpponent);

								//remove opponents figure
								this.board[indexRow][indexColumn] = this.space;
								//remove my figure from its previous place
								this.board[indexRow - 1][indexColumn + 1] = this.space;
								//place it one step over opponents figure
								this.board[indexRow + 1][indexColumn - 1] = queenFigure;
								++indexRow;
								--indexColumn;
								doesQueenAteSomeone = true;
							}
						}
					} else if (this.board[indexRow][indexColumn] !== this.space) {
						return { everythingOk: false, hasOneMoreStep: false };
					} else {
						this.board[indexRow - 1][indexColumn + 1] = this.space;
						this.board[indexRow][indexColumn] = queenFigure;
					}
					indexRow++;
				}
			}
		} else {
			indexRow = fromRowIndex - 1;
			if (fromColumnIndex < toColumnIndex) {
				//Up Right
				for (
					indexColumn = fromColumnIndex + 1;
					indexColumn <= toColumnIndex && indexRow >= toRowIndex;
					indexColumn++
				) {
					if (
						this.board[indexRow][indexColumn] === (eatableOpponent = opponentFigure) ||
						this.board[indexRow][indexColumn] === (eatableOpponent = opponentQueen)
					) {
						//eat
						if (indexRow - 1 >= 0 && indexColumn + 1 < this.board.length) {
							if (this.board[indexRow - 1][indexColumn + 1] === this.space) {
								this.addScore(eatableOpponent);

								//remove opponents figure
								this.board[indexRow][indexColumn] = this.space;
								//remove my figure from its previous place
								this.board[indexRow + 1][indexColumn - 1] = this.space;
								//place it one step over opponents figure
								this.board[indexRow - 1][indexColumn + 1] = queenFigure;
								--indexRow;
								++indexColumn;
								doesQueenAteSomeone = true;
							}
						}
					} else if (this.board[indexRow][indexColumn] !== this.space) {
						return { everythingOk: false, hasOneMoreStep: false };
					} else {
						this.board[indexRow + 1][indexColumn - 1] = this.space;
						this.board[indexRow][indexColumn] = queenFigure;
					}
					indexRow--;
				}
			} else {
				//Up Left
				for (
					indexColumn = fromColumnIndex - 1;
					indexColumn >= toColumnIndex && indexRow >= toRowIndex;
					indexColumn--
				) {
					if (
						this.board[indexRow][indexColumn] === (eatableOpponent = opponentFigure) ||
						this.board[indexRow][indexColumn] === (eatableOpponent = opponentQueen)
					) {
						//eat
						if (indexRow - 1 >= 0 && indexColumn - 1 >= 0) {
							if (this.board[indexRow - 1][indexColumn - 1] === this.space) {
								//add score
								this.addScore(eatableOpponent);

								//remove opponents figure
								this.board[indexRow][indexColumn] = this.space;
								//remove my figure from its previous place
								this.board[indexRow + 1][indexColumn + 1] = this.space;
								//place it one step over opponents figure
								this.board[indexRow - 1][indexColumn - 1] = queenFigure;
								--indexRow;
								--indexColumn;

								doesQueenAteSomeone = true;
							}
						}
					} else if (this.board[indexRow][indexColumn] !== this.space) {
						return { everythingOk: false, hasOneMoreStep: false };
					} else {
						this.board[indexRow + 1][indexColumn + 1] = this.space;
						this.board[indexRow][indexColumn] = queenFigure;
					}
					indexRow--;
				}
			}
		}
		if (doesQueenAteSomeone && this.queenHasOneMoreStep(indexRow, indexColumn)) {
			return { everythingOk: true, hasOneMoreStep: true };
		}
		return { everythingOk: true, hasOneMoreStep: false };
	}

	addToHistory(moves: string) {
		this.history.push({
			move: moves,
			board: this.board.map((row) => row.slice()),
			whiteScore: this.whiteScore.map((index) => index.slice()),
			blackScore: this.blackScore.map((index) => index.slice()),
			whosTurn: this.whosTurn,
		});
	}

	getLastMove(): BoardHistory | null {
		return this.history.peek();
	}

	oneStepBack(): boolean {
		let getBoardHistory: BoardHistory | null = this.history.pop();
		if (getBoardHistory) {
			this.board = getBoardHistory.board;
			this.whiteScore = getBoardHistory.whiteScore;
			this.blackScore = getBoardHistory.blackScore;
			this.whosTurn = getBoardHistory.whosTurn;
			return true;
		}
		return false;
	}

    goToIndexStepBack(index: number): boolean {
        let getBoardHistory: BoardHistory | null = this.history.getByIndex(index);
        if (getBoardHistory) {
			this.board = getBoardHistory.board;
			this.whiteScore = getBoardHistory.whiteScore;
			this.blackScore = getBoardHistory.blackScore;
			this.whosTurn = getBoardHistory.whosTurn;
			return true;
		}
		return false;
    }

	isQueenAndIsRightQueen(row: string, column: string): boolean {
		const isWhitesTurn = this.whosTurn === this.white;
		const queenFigure = isWhitesTurn ? this.whiteQueen : this.blackQueen;

		const rowIndex = isWhitesTurn
			? this.positionConstantsForWhitess[row]
			: this.positionConstantsForBlacks[row];
		const columnIndex = isWhitesTurn
			? this.positionConstantsForWhitess[column]
			: this.positionConstantsForBlacks[column];

		return this.board[rowIndex][columnIndex] === queenFigure;
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
		const movesArr: BoardHistory[] | null = this.history.getAllMovesHistory();

		for (let row = 0; row < this.board.length; row++) {
			for (let column = -1; column < this.board.length; column++) {
				if (column === -1) {
					str = str.concat(`${alphabet[isBlacksTurn ? alphabetIndex-- : alphabetIndex++]}`);
				} else {
					str = str.concat(`[${this.board[row][column]}]`);
				}
			}
			//showing on right side all previous moves
			if (movesArr) {
				let movesArrIndex = row;
				while (movesArrIndex < this.history.size) {
					str = str.concat(`\t${movesArrIndex + 1}: ${movesArr[movesArrIndex].whosTurn} ${movesArr[movesArrIndex].move}`);
					movesArrIndex += this.board.length;
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

	addScore(opponent: string): void {
		if (this.whosTurn === this.white) {
			this.whiteScore.push(opponent);
		} else {
			this.blackScore.push(opponent);
		}
	}

	hasOneMoreStep(row: number, column: number): boolean {
		const opponent = this.whosTurn === this.black ? this.white : this.black;
		const opponentQueen = this.whosTurn === this.black ? this.whiteQueen : this.blackQueen;
		//check right side
		if (
			row - 2 >= 0 &&
			column + 2 < this.board.length &&
			(this.board[row - 1][column + 1] === opponent ||
				this.board[row - 1][column + 1] === opponentQueen) &&
			this.board[row - 2][column + 2] === this.space
		) {
			return true;
		}

		//check left side
		if (
			row - 2 >= 0 &&
			column - 2 >= 0 &&
			(this.board[row - 1][column - 1] === opponent ||
				this.board[row - 1][column - 1] === opponentQueen) &&
			this.board[row - 2][column - 2] === this.space
		) {
			return true;
		}

		//check rightDown side
		if (
			row + 2 < this.board.length &&
			column + 2 < this.board.length &&
			(this.board[row + 1][column + 1] === opponent ||
				this.board[row + 1][column + 1] === opponentQueen) &&
			this.board[row + 2][column + 2] === this.space
		) {
			return true;
		}

		//check leftDown side
		if (
			row + 2 < this.board.length &&
			column - 2 >= 0 &&
			(this.board[row + 1][column - 1] === opponent ||
				this.board[row + 1][column - 1] === opponentQueen) &&
			this.board[row + 2][column - 2] === this.space
		) {
			return true;
		}

		return false;
	}

	queenHasOneMoreStep(row: number, column: number): boolean {
		const opponent = this.whosTurn === this.black ? this.white : this.black;
		const opponentQueen = this.whosTurn === this.black ? this.whiteQueen : this.blackQueen;

		//right
		if (row !== 0) {
			//right up
			for (
				let rowIndex = row - 1, columnIndex = column + 1;
				rowIndex > 0 && columnIndex < this.board.length - 1;
				rowIndex--, columnIndex++
			) {
				let checkBox = this.board[rowIndex][columnIndex];
				let nextCheckBox = this.board[rowIndex - 1][columnIndex + 1];

				if (checkBox !== this.space) {
					if (
						(checkBox === opponent || checkBox === opponentQueen) &&
						nextCheckBox === this.space
					) {
						return true;
					}
				}
			}
			//right down
			for (
				let rowIndex = row + 1, columnIndex = column + 1;
				rowIndex < this.board.length - 1 && columnIndex < this.board.length - 1;
				rowIndex++, columnIndex++
			) {
				let checkBox = this.board[rowIndex][columnIndex];
				let nextCheckBox = this.board[rowIndex + 1][columnIndex + 1];

				if (checkBox !== this.space) {
					if (
						(checkBox === opponent || checkBox === opponentQueen) &&
						nextCheckBox === this.space
					) {
						return true;
					}
				}
			}
		}

		//left
		if (row !== this.board.length - 1) {
			//left up
			for (
				let rowIndex = row - 1, columnIndex = column - 1;
				rowIndex > 0 && columnIndex > 0;
				rowIndex--, columnIndex--
			) {
				let checkBox = this.board[rowIndex][columnIndex];
				let nextCheckBox = this.board[rowIndex - 1][columnIndex - 1];

				if (checkBox !== this.space) {
					if (
						(checkBox === opponent || checkBox === opponentQueen) &&
						nextCheckBox === this.space
					) {
						return true;
					}
				}
			}
			//left down
			for (
				let rowIndex = row + 1, columnIndex = column - 1;
				rowIndex < this.board.length - 1 && columnIndex > 0;
				rowIndex++, columnIndex--
			) {
				let checkBox = this.board[rowIndex][columnIndex];
				let nextCheckBox = this.board[rowIndex + 1][columnIndex - 1];

				if (checkBox !== this.space) {
					if (
						(checkBox === opponent || checkBox === opponentQueen) &&
						nextCheckBox === this.space
					) {
						return true;
					}
				}
			}
		}

		return false;
	}

	becomeQueen(row: number, column: number): void {
		if (row === 0) {
			this.board[row][column] = this.whosTurn === this.white ? this.whiteQueen : this.blackQueen;
		}
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

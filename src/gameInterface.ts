import { Board } from "./board";
import PromptSync from "prompt-sync";

export class GameInterface {
	private readonly board: Board = new Board();
	private readonly prompt = PromptSync({
		sigint: true,
	});

	start(): void {
		console.log("Start the game");
		switch (this.prompt("Type any character to start or 'N' to exit: ").trim().toLowerCase()) {
			case "n": {
				break;
			}
			default: {
				this.clearConsole();
				this.game();
				break;
			}
		}
	}

	game() {
		let countOfPreviousLines = 12;
		let cautionMessage = "";
		const rowChars: string[] = ["H", "G", "F", "E", "D", "C", "B", "A"];
		let goToNextPlayer: { everythingOk: boolean; hasOneMoreStep: boolean } = {
			everythingOk: false,
			hasOneMoreStep: false,
		};

		while (this.board.displayWinner()) {
			this.clearConsole();
			console.log(cautionMessage);
			cautionMessage = "";
			this.board.display();
			console.log(
				"R - for right, L - for left, RD - for right down, LD - for left down:\nFor Queen you should write 'q' and then both place and direction\n(queen example` qH2 E5)"
			);
			const consoleInput = this.prompt("(example` C1 R): - ").trim().toUpperCase();

			if (consoleInput.length === 6) {
				//if queen move
				if (consoleInput.charAt(0) === "Q") {
					const comandsArr: string[] = consoleInput.split(" ");
					const fromRow: string = comandsArr[0].charAt(1);
					const fromColumn: string = comandsArr[0].charAt(2);
					const toRow: string = comandsArr[1].charAt(0);
					const toColumn: string = comandsArr[1].charAt(1);

					if (!rowChars.includes(fromRow) && !rowChars.includes(toRow)) {
						cautionMessage = `Not a valid row index (should be from A to H)!!!`;
						continue;
					} else if (!Number(fromColumn) && !Number(toColumn)) {
						cautionMessage = `Not a valid column value (should be from 1 to 8)!!!`;
						continue;
					} else {
						const num = parseInt(fromColumn);
                        const num2 = parseInt(toColumn);
						if (num <= 0 || num > 8 || num2 <= 0 || num2 > 8) {
							cautionMessage = `Not a valid column value (should be from 1 to 8)!!!`;
							continue;
						}
					}

                    if (!this.board.isQueenAndIsRightQueen(fromRow, fromColumn)) {
                        cautionMessage = "Not a valid index Or not valid Queen!!!"
                        continue;
                    }

                    goToNextPlayer = this.board.queenMove(fromRow, fromColumn, toRow, toColumn);
				}
			} else {
				if (!(consoleInput.length >= 4 && consoleInput.length <= 5)) {
					cautionMessage = "Write according to syntax, as shown in example!!!";
					continue;
				}

				const comandsArr: string[] = consoleInput.split(" ");

				const row: string = comandsArr[0].charAt(0);
				const column: string = comandsArr[0].charAt(1);

				if (!rowChars.includes(row)) {
					cautionMessage = `'${row}' is not a valid row index (should be from A to H)!!!`;
					continue;
				} else if (!Number(column)) {
					cautionMessage = `'${column}' is not a valid column value (should be from 1 to 8)!!!`;
					continue;
				} else {
					const num = parseInt(column);
					if (num <= 0 || num > 8) {
						cautionMessage = `'${column}' is not a valid column value (should be from 1 to 8)!!!`;
						continue;
					}
				}

				switch (comandsArr[1]) {
					case "R": {
						goToNextPlayer = this.board.right(row, column);
						countOfPreviousLines = 12;
						break;
					}
					case "L": {
						goToNextPlayer = this.board.left(row, column);
						countOfPreviousLines = 12;
						break;
					}
					case "RD": {
						goToNextPlayer = this.board.rightDown(row, column);
						countOfPreviousLines = 12;
						break;
					}
					case "LD": {
						goToNextPlayer = this.board.leftDown(row, column);
						countOfPreviousLines = 12;
						break;
					}
					default: {
						countOfPreviousLines = 12;
						console.log("WRONG KEY!!");
					}
				}
			}
			if (goToNextPlayer.hasOneMoreStep) {
				cautionMessage = "You have one more step";
			} else if (goToNextPlayer.everythingOk) {
				this.board.rotateBoard();
			} else {
				cautionMessage = "WRONG OPERATION!!!";
			}
		}
	}

	clearConsole() {
		process.stdout.write("\u001B[2J\u001B[0;0f");
	}
}

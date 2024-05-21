import { Board } from "./board";
import PromptSync from "prompt-sync";

export class GameInterface {
	private board: Board = new Board();
	private prompt = PromptSync({
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
        const rowChars: string[] = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];

		while (this.board.displayWinner()) {
			this.clearConsole();
            console.log(cautionMessage);
            cautionMessage = "";
			this.board.display();
            console.log("R - for right, L - for left, RD - for right down, LD - for left down:");
			const consoleInput = this.prompt("(example` C1 R): - ").trim().toUpperCase();

            if (!(consoleInput.length >= 4 && consoleInput.length <= 5)) {
                cautionMessage = "Write according to syntax, as shown in example"
                continue;
            }

			const comandsArr: string[] = consoleInput.split(" ");

			const row: string = comandsArr[0].charAt(0);
			const column: string = comandsArr[0].charAt(1);

            if (!rowChars.includes(row)) {
                cautionMessage = `${row} is not a valid row index (should be from A to H)`;
                continue;
            } else if (!Number(column)) {
                cautionMessage = `${column} is not a valid column value (should be from 1 to 8 ---)`
                continue;
            } else {
                const num = parseInt(column);
                if (num <= 0 || num > 8) {
                    cautionMessage = `${column} is not a valid column value (should be from 1 to 8)`
                    continue;
                }
            }

			let goToNextPlayer: boolean = false;

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

			if (goToNextPlayer) {
				this.board.rotateBoard();
			} else {
                cautionMessage = "WRONG OPERATION!!!"
            }
		}
	}

	clearConsole() {
		process.stdout.write("\u001B[2J\u001B[0;0f");
	}
}

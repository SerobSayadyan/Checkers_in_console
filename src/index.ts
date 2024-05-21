import { Board } from "./board";

import { GameInterface } from "./gameInterface";

let board = new Board();
// board.display();
// board.right('C', '3');
// board.right('D', '4');
// board.right('B', '2');
// board.display();

// board.rotateBoard();

// board.display();
// console.log(board.right('F', '6'));
// board.rotateBoard();
// board.left('D', '2');
// board.display();
// board.board[4][3] = board.white;
// board.rotateBoard();
// board.display();
// console.log(board.leftDown('D', '4'));
// board.display();
// board.leftDown('D', '4');
// board.display();
// board.right('D', '4');
// board.display();
// board.rightDown('F', '6')
// board.display();


let game = new GameInterface();
game.start();
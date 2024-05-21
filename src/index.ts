import { Board } from "./board";

import { GameInterface } from "./gameInterface";

let board = new Board();
// board.display();
// board.right('C', '1');
// board.display();

// board.rotateBoard();
// board.right('F', '8');
// board.display();

// board.rotateBoard();
// board.left('D', '2');
// board.display();

// board.rotateBoard();
// console.log(board.left('E', '2'));
// board.display();
// board.leftDown('D', '4');
// board.display();
// board.right('D', '4');
// board.display();
// board.rightDown('F', '6')
// board.display();


let game = new GameInterface();
game.start();
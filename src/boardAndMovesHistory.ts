import { BoardBoxTypes } from "./board";

export type BoardHistory = {
    move: string
    board: BoardBoxTypes[][]
    whiteScore: string[];
    blackScore: string[];
    whosTurn: string;
};

export class BoardAndMovesHistory {

    private readonly boardHistory: BoardHistory[] = [];
    private _size: number = 0;

    push(element: BoardHistory): void {
        this._size++; 
        this.boardHistory.push(element);
    }

    pop(): BoardHistory | null  {
        if (!this.isEmpty() ) {
            this._size--;
            return this.boardHistory.pop()!    
        }
        return null;
    }

    peek(): BoardHistory | null {
        if (this.isEmpty()) {
            return null;
        }

        return this.boardHistory[this._size - 1]
    }

    isEmpty(): boolean {
        return this._size === 0;
    }

    getByIndex(index: number): BoardHistory | null {

        if (this.isEmpty() || index >= this._size || index < 0) {
            return null;
        }

        let result = this.boardHistory[index];
        let lastIndex: number = this._size - 1;

        while (lastIndex >= index) {
            this.pop();
            lastIndex--;
        }

        return result;
    }

    getAllMovesHistory(): BoardHistory[] | null {
        return this.isEmpty() ? null : this.boardHistory;
    }

    get size(): number {
        return this._size;
    }

}
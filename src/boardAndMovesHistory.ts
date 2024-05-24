export type BoardHistory = {
    move: string
    board: string[][]
    whiteScore: string[];
    blackScore: string[];
    whosTurn: string;
};

export class BoardAndMovesHistory {

    private readonly boardHistory: BoardHistory[] = [];
    private size: number = 0;

    push(element: BoardHistory): void {
        this.size++; 
        this.boardHistory.push(element);
    }

    pop(): BoardHistory | null  {
        if (!this.isEmpty() ) {
            this.size--;
            return this.boardHistory.pop()!    
        }
        return null;
    }

    peek(): BoardHistory | null {
        if (this.isEmpty()) {
            return null;
        }

        return this.boardHistory[this.size - 1]
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

}
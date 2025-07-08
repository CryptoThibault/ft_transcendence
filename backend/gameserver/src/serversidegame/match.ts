export class Match {
    winner?: number;
    score: number[] = [0, 0];
    played: boolean = false;

    constructor(
        public player1: string,
        public player2: string
    ) {}

    setWinner() {
        this.winner = this.score[0] > this.score[1] ? 0 : 1;
        this.played = true;
        console.log(`DB player ${this.winner} win, score ${this.score}`);
    }
}
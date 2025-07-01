export class Match {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.score = [0, 0];
        this.played = false;
    }
    setWinner() {
        this.winner = this.score[0] > this.score[1] ? 0 : 1;
        this.played = true;
        console.log(`DB player ${this.winner} win, score ${this.score}`);
    }
}

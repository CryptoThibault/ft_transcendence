import { Match } from "./match.js";
import { gameStates } from "./state.js";
import { renderRanking } from "./render.js";
export class Tournament {
    constructor(players) {
        this.players = players;
        this.matches = [];
        this.currentMatchIndex = 0;
        if (players.length !== 4)
            throw new Error("Tournament requires exactly 4 players.");
        this.matches.push(new Match(2, players[0], players[1]));
        this.matches.push(new Match(2, players[2], players[3]));
    }
    startNextMatch() {
        if (this.currentMatchIndex === 2) {
            this.matches.push(new Match(2, this.players[this.getLooserIndex(0)], this.players[this.getLooserIndex(1)]));
            this.matches.push(new Match(2, this.players[this.getWinnerIndex(0)], this.players[this.getWinnerIndex(1)]));
        }
        else if (this.currentMatchIndex === 4) {
            renderRanking(this.getRanking());
            return;
        }
        const currentMatch = this.matches[this.currentMatchIndex];
        currentMatch.onEnd = () => {
            gameStates.isIntro = true;
            this.currentMatchIndex++;
            setTimeout(() => {
                this.startNextMatch();
            }, 50);
        };
        currentMatch.start();
    }
    getRanking() {
        const ranking = [];
        ranking.push(this.matches[3].winner);
        ranking.push(this.getLooser(3));
        ranking.push(this.matches[2].winner);
        ranking.push(this.getLooser(2));
        return ranking;
    }
    getWinnerIndex(matchIndex) {
        return this.players.indexOf(this.matches[matchIndex].winner);
    }
    getLooserIndex(matchIndex) {
        return this.players.indexOf(this.getLooser(matchIndex));
    }
    getLooser(matchIndex) {
        return this.matches[matchIndex].player1 === this.matches[matchIndex].winner
            ? this.matches[matchIndex].player2 : this.matches[matchIndex].player1;
    }
}

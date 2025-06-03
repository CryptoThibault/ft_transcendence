import { Match } from "./match.js"

export class Tournament {
  matches: Match[] = [];
  currentMatchIndex: number = 0;
  isFinished: boolean = false;

  constructor(players: string[]) {
    if (players.length !== 4) {
      throw new Error("Tournament requires exactly 4 players.");
    }

    this.matches.push(new Match(players[0], players[1]));
    this.matches.push(new Match(players[2], players[3]));
    this.matches.push(new Match("", ""));
  }

  getCurrentMatch(): Match | null {
    if (this.isFinished || this.currentMatchIndex >= this.matches.length) {
      return null;
    }
    return this.matches[this.currentMatchIndex];
  }

  recordWinner(winner: string) {
    const match = this.getCurrentMatch();
    if (!match) return;

    match.setWinner();

    if (this.currentMatchIndex === 0) {
      this.matches[2].player1 = winner;
    } else if (this.currentMatchIndex === 1) {
      this.matches[2].player2 = winner;
    }

    this.currentMatchIndex++;

    if (this.currentMatchIndex >= this.matches.length) {
      this.isFinished = true;
    } else {
    }
  }

  getWinner(): string | null {
    if (!this.isFinished) return null;
    return this.matches[2].winner || null;
  }
}
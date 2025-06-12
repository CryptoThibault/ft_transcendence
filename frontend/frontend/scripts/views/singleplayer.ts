import { Match } from "../game/match.js";

export class SinglePlayer {
    async getHtml() {
        return `
            <h1 class="title">Single Player</h1>
            <canvas id="gameCanvas"></canvas>
        `;
    }

    onMounted() {
        const match: Match = new Match(0, "player", "ai");
        match.start();
    }

}
import { Match } from "../game/match.js";

export class SinglePlayer {
    async getHtml() {
        return `
            <h1 class="header_custom mb-15" data-i18n="singleplayer">Singleplayer</h1>
            <h2 class="text-3xl sm:text-xl md:text-2xl font-mono mb-20 drop-shadow-[2px_2px_0_gris] [text-shadow:_2px_2px_0_rgba(0,0,0,0.8)]" data-i18n="single_title">Play against the AI!</h2>
            <canvas id="gameCanvas"></canvas>
        `;
    }

    onMounted() {
        const match: Match = new Match(0, "player", "ai");
        match.start();
    }

}
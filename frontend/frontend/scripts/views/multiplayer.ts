import {multiNicknames} from "./home.js"

import { Match } from "../game/match.js";

export class Multiplayer {
    async getHtml() {
        return `
            <h2 class="text-3xl sm:text-xl md:text-2xl font-mono mb-20 drop-shadow-[2px_2px_0_gris] [text-shadow:_2px_2px_0_rgba(0,0,0,0.8)]" data-i18n="multi_title">Play against your friends in real-time!</h2>
            <h2 class="text-black text-2xl mb-14 font-bold">
            ${multiNicknames[0]}
            <span class="text-xl font-normal mx-4">vs</span>
            ${multiNicknames[1]}
            </h2>            
            <canvas id="gameCanvas"></canvas>
        `;
    }

    onMounted() {
        const match: Match = new Match(1, multiNicknames[0], multiNicknames[1]);;
        match.start();
    }

}
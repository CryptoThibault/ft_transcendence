//import { Match } from "../game/match";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class SinglePlayer {
    getHtml() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
            <h1 class="title">Single Player</h1>
            <canvas id="gameCanvas"></canvas>
        `;
        });
    }
    // import { initGameSinglePlayer } from "../game/main.js
    // async onMounted() {
    //     await new Promise((resolve) => requestAnimationFrame(resolve));
    //     initGameSinglePlayer();
    // }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = document.querySelector("script[data-game-script]");
            if (existing)
                existing.remove();
            const script = document.createElement("script");
            script.type = "module";
            script.src = "/dist/pong/src/main.js";
            script.setAttribute("data-game-script", "true");
            document.body.appendChild(script);
        });
    }
}
// function initGameSinglePlayer() {
//     const match: Match = new Match(0, "ME", "AI");
//     match.start();
// }

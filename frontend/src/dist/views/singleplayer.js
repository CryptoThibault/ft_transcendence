var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Match } from "../game/match.js";
export class SinglePlayer {
    getHtml() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
            <h1 class="header_custom mb-15" data-i18n="singleplayer">Singleplayer</h1>
            <h2 class="text-3xl sm:text-xl md:text-2xl mb-20 drop-shadow-[2px_2px_0_gris] [text-shadow:_2px_2px_0_rgba(0,0,0,0.8)]" data-i18n="single_title">Play against the AI!</h2>
            <canvas id="gameCanvas"></canvas>
        `;
        });
    }
    onMounted() {
        const match = new Match(0, "player", "ai");
        match.start();
    }
}

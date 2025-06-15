var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { tournamentNicknames } from "./home.js";
import { Tournament } from "../game/tournament.js";
export class TournamentView {
    getHtml() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
			<h1 class="header_custom mb-15" data-i18n="tournament">Tournament</h1>
			<h2 class="text-lg mb-15 drop-shadow-[2px_2px_0_gris] [text-shadow:_2px_2px_0_rgba(0,0,0,0.8)]" data-i18n="tournament_title">Play against other players in a tournament!</h2> 
			<h2 class="text-gray-800 text-lg mb-14">
			Players:
			<span class="font-bold text-lg mx-1">${tournamentNicknames[0]}</span>,
			<span class="font-bold text-lg mx-1">${tournamentNicknames[1]}</span>,
			<span class="font-bold text-lg mx-1">${tournamentNicknames[2]}</span>,
			<span class="font-bold text-lg mx-1">${tournamentNicknames[3]}</span>
			</h2>
            <canvas id="gameCanvas"></canvas>
        `;
        });
    }
    onMounted() {
        const tournament = new Tournament(tournamentNicknames);
        tournament.startNextMatch();
    }
}

// export class TournamentView {
//     async getHtml() {
// 		return `
//       <h2>tour</h2>
//     `;
// 	}
// }
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class TournamentView {
    getHtml() {
        return __awaiter(this, void 0, void 0, function* () {
            const players = JSON.parse(localStorage.getItem("tournamentPlayers") || "[]");
            const playerListHtml = players.map((name, i) => `<li>${i + 1}. ${name}</li>`).join("");
            return `
			<h2 class="text-2xl font-bold mb-4">Tournament</h2>
			<ul class="list-disc pl-5">
				${playerListHtml}
			</ul>
		`;
        });
    }
}

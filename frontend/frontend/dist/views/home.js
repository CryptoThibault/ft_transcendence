var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { navigateTo } from "../main.js";
export class HomeView {
    getHtml() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
      <h2 class="header_custom" data-i18n="welcome">Welcome to Pong42</h2>

	  <div class="flex flex-col sm:flex-row gap-10">
		<a href="/single_player" data-link class="btn-gamemode" data-i18n="single_player">
			Single player
		</a>
		<a href="/multiplayer" data-link class="btn-gamemode" data-i18n="multiplayer">
			Multiplayer
		</a>
		<button id="tournamentBtn" class="btn-gamemode" data-i18n="tournament">
			Tournament
		</button>
	  </div>

	  <!-- Tournament Popup -->
	  <div id="tournamentPopup" class="fixed inset-0 items-center justify-center bg-black/50 backdrop-blur-sm hidden z-50">
		<div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
			<h3 data-i18n="tournament_players" class=" text-black text-lg font-semibold mb-4">Tournament Players</h3>

			
			<div id="nicknameInputs" class="flex flex-col gap-2 mb-4"></div>
			<div class="flex justify-end gap-2">
				<button data-i18n="cancel" id="cancelPopup" class="px-4 py-2 bg-gray-500 rounded hover:bg-gray-800">Cancel</button>
				<button data-i18n="start" id="startTournament" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-950">Start</button>
			</div>
		</div>
	  </div>
    `;
        });
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const tournamentBtn = document.getElementById("tournamentBtn");
            const popup = document.getElementById("tournamentPopup");
            const playerCountSelect = 4;
            const nicknameInputs = document.getElementById("nicknameInputs");
            const cancelPopup = document.getElementById("cancelPopup");
            const startBtn = document.getElementById("startTournament");
            const mainContent = document.getElementById("mainContent");
            tournamentBtn.addEventListener("click", () => {
                popup.classList.remove("hidden");
                popup.classList.add("flex");
                nicknameInputs.textContent = "";
                for (let i = 0; i < 4; i++) {
                    const label = document.createElement("label");
                    label.textContent = `Player ${i + 1}`;
                    label.className = "text-black text-left font-semibold mb-1 block";
                    const input = document.createElement("input");
                    input.type = "text";
                    input.id = `nickname${i}`;
                    input.className = "text-black p-2 border rounded mb-3 block w-full";
                    nicknameInputs.appendChild(label);
                    nicknameInputs.appendChild(input);
                }
            });
            cancelPopup.addEventListener("click", () => {
                popup.classList.add("hidden");
                mainContent.classList.remove("blur-sm", "pointer-events-none", "select-none");
            });
            startBtn.addEventListener("click", () => {
                const count = 4;
                const nicknames = Array.from({ length: count }).map((_, i) => {
                    const input = document.getElementById(`nickname${i}`);
                    return input.value.trim() || `Player ${i + 1}`;
                });
                localStorage.setItem("tournamentPlayers", JSON.stringify(nicknames));
                popup.classList.add("hidden");
                navigateTo("/tournament");
            });
        });
    }
}

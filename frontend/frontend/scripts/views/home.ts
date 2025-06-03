
// export class HomeView{
//     async getHtml() {
// 		return `
//       <h2 class="header_custom" data-i18n="welcome">Welcome to Pong42</h2>
	
// 	<div class="flex flex-col sm:flex-row gap-10">
// 		<button href="/single_player" data-link class="btn-gamemode" data-i18n="single_player">
// 		Single player
// 		</button>
// 		<button href="/multiplayer" data-link class="btn-gamemode" data-i18n="multiplayer">
// 		Multiplayer
// 		</button>
// 		<button href="/tournament" data-link class="btn-gamemode" data-i18n="tournament">
// 		Tournament
// 		</button>
// 	</div>
//     `;
// 	}
// }


import { navigateTo } from "../main.js";
export class HomeView {
	async getHtml() {
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
	  <div id="tournamentPopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50">
		<div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
			<h3 class=" text-black text-lg font-semibold mb-4">Number player</h3>
			<select id="playerCount" class=" text-black w-full p-2 border rounded mb-4">
				<option value="3">3 players</option>
				<option value="4">4 players</option>
				
			</select>
			<div id="nicknameInputs" class="flex flex-col gap-2 mb-4"></div>
			<div class="flex justify-end gap-2">
				<button id="cancelPopup" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
				<button id="startTournament" class="px-4 py-2 bg-blue-600 text-white rounded">Start</button>
			</div>
		</div>
	  </div>
    `;
	}

	async onMounted() {
		const tournamentBtn = document.getElementById("tournamentBtn")!;
		const popup = document.getElementById("tournamentPopup")!;
		const playerCountSelect = document.getElementById("playerCount") as HTMLSelectElement;
		const nicknameInputs = document.getElementById("nicknameInputs")!;
		const cancelPopup = document.getElementById("cancelPopup")!;
		const startBtn = document.getElementById("startTournament")!;

		tournamentBtn.addEventListener("click", () => {
			popup.classList.remove("hidden");
			renderNickInputs(parseInt(playerCountSelect.value));
		});

		cancelPopup.addEventListener("click", () => {
			popup.classList.add("hidden");
		});

		playerCountSelect.addEventListener("change", () => {
			const count = parseInt(playerCountSelect.value);
			renderNickInputs(count);
		});

		startBtn.addEventListener("click", () => {
			const count = parseInt(playerCountSelect.value);
			const nicknames = Array.from({ length: count }).map((_, i) => {
				const input = document.getElementById(`nickname${i}`) as HTMLInputElement;
				return input.value.trim() || `Player ${i + 1}`;
			});
			localStorage.setItem("tournamentPlayers", JSON.stringify(nicknames));
			popup.classList.add("hidden");
			navigateTo("/tournament");
		});

		function renderNickInputs(count: number) {
			nicknameInputs.innerHTML = "";
			for (let i = 0; i < count; i++) {
				nicknameInputs.innerHTML += `
					<input type="text" id="nickname${i}" class=" text-black p-2 border rounded" placeholder="Player ${i + 1}" />
				`;
			}
		}
	}
}

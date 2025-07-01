import { navigateTo } from "../main.js";

export let tournamentNicknames: string[] = ["Player 1", "Player 2", "Player 3", "Player 4"];

export let multiNicknames: string[] = ["Player 1", "Player 2"];

export class HomeView {
	async getHtml() {
		return `
      <h2 class="header_custom" data-i18n="welcome">Welcome to Pong42</h2>

	  <div class="flex flex-col sm:flex-row gap-8">
		<a href="/singleplayer" data-link class="btn-gamemode" data-i18n="singleplayer">
			Single player
		</a>
		<button id="multiPlayerBtn" class="btn-gamemode" data-i18n="multiplayer"">
			Multiplayer
		</button>
		<button id="tournamentBtn" class="btn-gamemode" data-i18n="tournament">
			Tournament
		</button>
	  </div>

	  <!-- Tournament Popup -->
	  <div id="tournamentPopup" class="fixed inset-0 items-center justify-center bg-black/50 backdrop-blur-sm hidden z-50">
		<div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
			<h3 data-i18n="tournament_players" class=" text-black text-lg mb-4">Tournament Players</h3>

			
			<div id="nicknameInputs" class="flex flex-col gap-2 mb-4"></div>
			<div class="flex justify-end gap-2">
				<button data-i18n="cancel" id="cancelPopup" class="px-4 py-2 bg-gray-500 rounded hover:bg-gray-800">Cancel</button>
				<button data-i18n="start" id="startTournament" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-950">Start</button>
			</div>
		</div>
	  </div>


	  <!-- Multiplayer Popup -->
		<div id="multiPlayerPopup" class="fixed inset-0 items-center justify-center bg-black/50 backdrop-blur-sm hidden z-50">
		<div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
			<h3 data-i18n="multi_players" class=" text-black text-lg mb-4">Players</h3>

			
			<div id="nicknameMultiInputs" class="flex flex-col gap-2 mb-4"></div>
			<div class="flex justify-end gap-2">
				<button data-i18n="cancel" id="cancelMultiPopup" class="px-4 py-2 bg-gray-500 rounded hover:bg-gray-800">Cancel</button>
				<button data-i18n="start" id="startMulti" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-950">Start</button>
			</div>
		</div>
	  </div>
    `;
	}

	async onMounted() {
		//handle tournament popup
		const tournamentBtn = document.getElementById("tournamentBtn")!;
		const tournamentPopup = document.getElementById("tournamentPopup")!;
		const nicknameInputs = document.getElementById("nicknameInputs")!;
		const cancelPopup = document.getElementById("cancelPopup")!;
		const startBtn = document.getElementById("startTournament")!;
		const mainContent = document.getElementById("mainContent")!;

		tournamentBtn.addEventListener("click", () => {
			tournamentPopup.classList.remove("hidden");
			tournamentPopup.classList.add("flex");
			nicknameInputs.textContent = "";

			Array.from({ length: 4 }).forEach((_, i) => {
				const label = document.createElement("label");
				label.textContent = `Player ${i + 1}`;
				label.className = "text-black text-left mb-1 block text-md leading-snug";

				const input = document.createElement("input");
				input.type = "text";
				input.id = `TournamentNickname${i}`;
				input.className = "text-black p-2 border rounded mb-3 block w-full";

				nicknameInputs.appendChild(label);
				nicknameInputs.appendChild(input);
			});
		});

		cancelPopup.addEventListener("click", () => {
			tournamentPopup.classList.add("hidden");
			mainContent.classList.remove("blur-sm", "pointer-events-none", "select-none");
		});

		startBtn.addEventListener("click", () => {
			const count = 4;
			const inputs = Array.from({ length: count }).map((_, i) => {
				const input = document.getElementById(`TournamentNickname${i}`) as HTMLInputElement;
				return input.value.trim() || `Player ${i + 1}`;
			});
			for (let i = 0; i < inputs.length; i++) {
				if (inputs[i].length > 8) {
					alert(`Nickname for Player ${i + 1} is too long (max 8 characters).`);
					return;
				}
			}
			const nicknameSet = new Set(inputs);
			if (nicknameSet.size !== inputs.length) {
				alert("Nicknames must be unique.");
				return;
			}
		
			tournamentNicknames = inputs;
			tournamentPopup.classList.add("hidden");
			navigateTo("/tournament");
		});

		//handle multiplayer popup
		const multiBtn = document.getElementById("multiPlayerBtn")!;
		const multiPopup = document.getElementById("multiPlayerPopup")!;
		const nicknameMultiInputs = document.getElementById("nicknameMultiInputs")!;
		const cancelMultiPopup = document.getElementById("cancelMultiPopup")!;
		const startMulti = document.getElementById("startMulti")!;

		multiBtn.addEventListener("click", () => {
			multiPopup.classList.remove("hidden");
			multiPopup.classList.add("flex");
			nicknameMultiInputs.textContent = "";

			for (let i = 0; i < 2; i++) {
				const label = document.createElement("label");
				label.textContent = `Player ${i + 1}`;
				label.className = "text-black text-left mb-1 block text-md leading-snug";

				const input = document.createElement("input");
				input.type = "text";
				input.id = `multiNickname${i}`;
				input.className = "text-black p-2 border rounded mb-3 block w-full";

				nicknameMultiInputs.appendChild(label);
				nicknameMultiInputs.appendChild(input);
			}
		});

		cancelMultiPopup.addEventListener("click", () => {
			multiPopup.classList.add("hidden");
			mainContent.classList.remove("blur-sm", "pointer-events-none", "select-none");
		});

		startMulti.addEventListener("click", () => {
			const count = 2;
			const nicknames = Array.from({ length: count }).map((_, i) => {
			  const input = document.getElementById(`multiNickname${i}`) as HTMLInputElement;
			  return input.value.trim() || `Player ${i + 1}`;
			});

			for (let i = 0; i < count; i++) {
			  if (nicknames[i].length > 8) {
				alert(`Player ${i + 1} nickname is too long (max 8 characters)`);
				return;
			  }
			}

			const uniqueNames = new Set(nicknames);
			if (uniqueNames.size !== nicknames.length) {
			  alert("Player's nicknames must be unique!");
			  return;
			}
			multiNicknames = nicknames;
			multiPopup.classList.add("hidden");
			navigateTo("/multiplayer");
		  });
	}
}
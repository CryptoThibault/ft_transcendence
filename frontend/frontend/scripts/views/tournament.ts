// export class TournamentView {
//     async getHtml() {
// 		return `
//       <h2>tour</h2>
//     `;
// 	}
// }

export class TournamentView {
	async getHtml() {
		const players = JSON.parse(localStorage.getItem("tournamentPlayers") || "[]");
		const playerListHtml = players.map((name: string, i: number) => `<li>${i + 1}. ${name}</li>`).join("");

		return `
			<h2 class="text-2xl font-bold mb-4">Tournament</h2>
			<ul class="list-disc pl-5">
				${playerListHtml}
			</ul>
		`;
	}
}

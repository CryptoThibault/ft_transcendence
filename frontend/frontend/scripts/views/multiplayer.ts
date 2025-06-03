export class Multiplayer{
    async getHtml() {
        return `
        <h2 class="header_custom" data-i18n="single_player">Single Player</h2>
        <div class="flex flex-col items-center">
            <button class="btn-gamemode" id="startGameButton" data-i18n="start_game">Start Game</button>
            <div id="gameStatus" class="mt-4 text-gray-700"></div>
        </div>
        `;
    }
}
export class SinglePlayer {
    async getHtml() {
        return `
            <h1 class="title">Single Player</h1>
            <canvas id="gameCanvas" width="800" height="500"></canvas>
        `;
    }
}
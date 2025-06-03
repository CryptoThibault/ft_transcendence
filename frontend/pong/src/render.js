import { MAX_SCORE } from "./config.js";
import { canvas, ctx, match, ball, leftPaddle, rightPaddle } from "./state.js";
function drawScores() {
    ctx.font = "100px 'Press Start 2P'";
    ctx.fillStyle = "white";
    ctx.fillText(`${match.score[0]}`, canvas.width / 2 - 100, 120);
    ctx.fillText(`${match.score[1]}`, canvas.width / 2 + 100, 120);
}
function drawCenterLine() {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.closePath();
}
function drawText() {
    ctx.font = "40px 'Press Start 2P'";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("Pong".split('').join(' '.repeat(1)), canvas.width / 2, canvas.height - 10);
}
export function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    leftPaddle.draw();
    rightPaddle.draw();
    drawScores();
    drawCenterLine();
    drawText();
}
export function renderPauseMenu() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 5);
    ctx.fillText("Press P to Resume", canvas.width / 2, canvas.height / 5 * 2);
    ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 5 * 3);
    ctx.fillText("Press ESC to Quit", canvas.width / 2, canvas.height / 5 * 4);
}
export function renderEndMenu() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("END", canvas.width / 2, canvas.height / 5);
    ctx.fillText(`${match.score[0] === MAX_SCORE ? "Left" : "Right"} player win !`, canvas.width / 2, canvas.height / 5 * 2);
    ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 5 * 3);
    ctx.fillText("Press ESC to Quit", canvas.width / 2, canvas.height / 5 * 4);
}

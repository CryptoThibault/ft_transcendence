import { gameStates, keys, match } from "./state.js";
import { updateGame } from "./update.js";
import { renderGame, renderPauseMenu, renderEndMenu } from "./render.js";
function togglePause() {
    gameStates.isRunning = !gameStates.isRunning;
    gameStates.isRunning ? requestAnimationFrame(gameLoop) : renderPauseMenu();
}
function restartGame() {
    window.location.reload();
}
function quitGame() {
    window.location.reload();
}
// if (gameStates.isRemote) {
//     window.addEventListener("keydown", (event) => {
//         fetch(`http://localhost:3000/update/`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ action: "keydown", key: event, player:"left" })
//         });
//     });
//     window.addEventListener("keyup", (event) => {
//         fetch(`http://localhost:3000/update/`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ action: "keyup", key: event, player: "left" })
//         });
//     });
// } else {
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape")
        quitGame();
    if (!gameStates.isEnd && event.key === "p")
        togglePause();
    if (event.key === "r")
        restartGame();
    if (gameStates.isRunning) {
        if (event.key === "w")
            keys.w = true;
        if (event.key === "s")
            keys.s = true;
        if (!gameStates.isSinglePlayer && event.key === "ArrowUp")
            keys.Up = true;
        if (!gameStates.isSinglePlayer && event.key === "ArrowDown")
            keys.Down = true;
    }
});
window.addEventListener("keyup", (event) => {
    if (gameStates.isRunning) {
        if (event.key === "w")
            keys.w = false;
        if (event.key === "s")
            keys.s = false;
        if (!gameStates.isSinglePlayer && event.key === "ArrowUp")
            keys.Up = false;
        if (!gameStates.isSinglePlayer && event.key === "ArrowDown")
            keys.Down = false;
    }
});
//}
export function gameLoop() {
    if (gameStates.isEnd) {
        gameStates.isRunning = false;
        renderEndMenu();
        match.setWinner();
    }
    if (!gameStates.isRunning)
        return;
    updateGame();
    renderGame();
    requestAnimationFrame(gameLoop);
}
gameLoop();

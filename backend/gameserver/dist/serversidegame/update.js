import { MAX_SPEED, SPEED_INC } from "./config.js";
import { gameStates, keys, ball, leftPaddle, rightPaddle, match } from "./state.js";
import { updateAI } from "./ia.js";
import { io } from "../initSocket.js";
function hitPaddle(ball, paddle) {
    return (ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.y + ball.radius > paddle.y);
}
function onPaddleHit(ball, paddle) {
    const paddleCenterY = paddle.y + paddle.height / 2;
    ball.dy = (ball.y - paddleCenterY) / (paddle.height / 2);
    ball.dx = -ball.dx;
    const length = Math.hypot(ball.dx, ball.dy);
    ball.dx /= length;
    ball.dy /= length;
    ball.speed = Math.min(ball.speed * SPEED_INC, MAX_SPEED);
    ball.x += ball.dx * ball.radius;
}
function sendGameStateToClients() {
    io.emit("game-update", { ball: { x: ball.x, y: ball.y }, rightPaddle: { x: rightPaddle.x, y: rightPaddle.y }, leftPaddle: { x: leftPaddle.x, y: leftPaddle.y }, "score_0": match.score[0], "score_1": match.score[1] });
}
export function sendGameEndToClients() {
    io.emit("game-end", { "winner": match.winner, "score-0": match.score[0], "score-1": match.score[1] });
}
export function updateGame() {
    ball.move();
    if (gameStates.isSinglePlayer)
        updateAI();
    if (keys.w)
        leftPaddle.moveUp();
    if (keys.s)
        leftPaddle.moveDown();
    if (keys.Up)
        rightPaddle.moveUp();
    if (keys.Down)
        rightPaddle.moveDown();
    if (hitPaddle(ball, leftPaddle))
        onPaddleHit(ball, leftPaddle);
    if (hitPaddle(ball, rightPaddle))
        onPaddleHit(ball, rightPaddle);
    sendGameStateToClients();
}

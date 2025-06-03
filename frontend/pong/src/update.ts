import { MAX_SPEED, SPEED_INC } from "./config.js";
import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { gameStates, keys, ball, leftPaddle, rightPaddle } from "./state.js";
import { updateAI } from "./ia.js";

function hitPaddle(ball:Ball, paddle: Paddle): boolean {
    return (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.y + ball.radius > paddle.y
    );
}

function onPaddleHit(ball: Ball, paddle: Paddle): void {
    const paddleCenterY = paddle.y + paddle.height / 2;
    ball.dy = (ball.y - paddleCenterY) / (paddle.height / 2);
    ball.dx = -ball.dx;

    const length = Math.hypot(ball.dx, ball.dy);
    ball.dx /= length;
    ball.dy /= length;
    ball.speed = Math.min(ball.speed * SPEED_INC, MAX_SPEED);
    ball.x += ball.dx * ball.radius;
}  

export function updateGame() {
    ball.move();
    if (gameStates.isSinglePlayer) updateAI();
    if (keys.w) leftPaddle.moveUp();
    if (keys.s) leftPaddle.moveDown();
    if (keys.Up) rightPaddle.moveUp();
    if (keys.Down) rightPaddle.moveDown();
    if (hitPaddle(ball, leftPaddle)) onPaddleHit(ball, leftPaddle);
    if (hitPaddle(ball, rightPaddle)) onPaddleHit(ball, rightPaddle);
}
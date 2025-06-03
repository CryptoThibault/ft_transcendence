import { MIN_SPEED, PADDLE_SPEED, MAX_SCORE } from "./config.js";
import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { Match } from "./match.js";

export let canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
export let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export let gameStates: { [key: string]: boolean } = {
    isSinglePlayer: true,
    isFirstUpdate: true,
    isRemote: false,
    isRunning: true,
    isEnd: false
}

export const match = new Match("player1", "player2");

export let keys: { [key: string]: boolean } = {
    w: false,
    s: false,
    Up: false,
    Down: false
};

const dxStart = Math.floor(Math.random() * 2) ? -1 : 1;
export const ball = new Ball(canvas.width / 2, canvas.height / 2, 5, dxStart, 0, MIN_SPEED, "white");

const paddleWidth = canvas.width * 0.01;
const paddleHeight = canvas.height * 0.15;
export const leftPaddle = new Paddle(5, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, PADDLE_SPEED, "white");
export const rightPaddle = new Paddle(canvas.width - paddleWidth - 5, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, PADDLE_SPEED, "white");

export function scoreGoal(player: number) {
    match.score[player]++;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = player ? -1 : 1;
    ball.dy = 0;
    ball.speed = MIN_SPEED;
    if (gameStates.isSinglePlayer) gameStates.isFirstUpdate = true;
    if (match.score[0] === MAX_SCORE || match.score[1] === MAX_SCORE)
        gameStates.isEnd = true;
}

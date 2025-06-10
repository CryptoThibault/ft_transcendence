import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./config.js";
import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
export let canvas = document.getElementById("gameCanvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
export let ctx = canvas.getContext("2d");
export let match = null;
export function setMatch(currentMatch) {
    match = currentMatch;
}
export let animationId = null;
export function setAnimationId(id) {
    animationId = id;
}
export let gameStates = {
    isIntro: false,
    isRunning: false,
    isEnd: false,
    isFirstUpdate: true
};
export let keys = {
    w: false,
    s: false,
    Up: false,
    Down: false
};
export const ball = new Ball();
export const leftPaddle = new Paddle();
export const rightPaddle = new Paddle();

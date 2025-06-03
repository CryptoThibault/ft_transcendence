import { BORDER } from "./config.js";
import { canvas, ctx } from "./state.js";
export class Paddle {
    constructor(x, y, width, height, speed, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
    }
    moveUp() {
        if (this.y - this.speed >= BORDER) {
            this.y -= this.speed;
        }
        else {
            this.y = BORDER;
        }
    }
    moveDown() {
        if (this.y + this.height + this.speed <= canvas.height - BORDER) {
            this.y += this.speed;
        }
        else {
            this.y = canvas.height - this.height - BORDER;
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    logPosition() {
        console.log(`Paddle position : x = ${this.x}, y = ${this.y}`);
    }
}

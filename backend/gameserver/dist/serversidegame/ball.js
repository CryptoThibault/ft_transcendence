import { canvas, scoreGoal } from "./state.js";
export class Ball {
    constructor(x, y, radius, dx, dy, speed, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.speed = speed;
        this.color = color;
    }
    move() {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
        if (this.x - this.radius < 0)
            scoreGoal(1);
        if (this.x + this.radius > canvas.width)
            scoreGoal(0);
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0)
            this.dy = -this.dy;
    }
    logPosition() {
        console.log(`Position de la balle : x = ${this.x}, y = ${this.y}`);
    }
}

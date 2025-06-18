import { MAX_SCORE } from "./config.js";
import { setMatch, gameStates, animationId, setAnimationId } from "./state.js";
import { gameLoop, initGame } from "./game.js";
import { renderEndMenu, renderMatchIntro, renderPauseMenu } from "./render.js";
import { userData } from "../views/login.js";

export class Match {
    winner: string | null = null;
    score: number[] = [0, 0];

    onEnd?: () => void;

    constructor(
        public gameMode: number,
        public player1: string,
        public player2: string
    ) {}

    start() {
        this.stop();
        setMatch(this);
        initGame();
        renderMatchIntro();
    }

    restart() {
        this.stop();
        this.winner = null;
        this.score = [0, 0];
        this.start();
    }

    pause() {
        gameStates.isRunning = !gameStates.isRunning;
        if (gameStates.isRunning)
            setAnimationId(requestAnimationFrame(gameLoop));
        else {
            this.stop();
            renderPauseMenu();
        }
    }

    end() {
        gameStates.isRunning = false;
        gameStates.isEnd = true;
        this.winner = this.score[0] === MAX_SCORE ? this.player1 : this.player2;
        this.stop();
        if (this.gameMode !== 2)
            setTimeout(() => {
                renderEndMenu();
            }, 50);
        
        if (userData)
            this.sendResult();
    
        if (this.onEnd) this.onEnd();
    }

    stop() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            setAnimationId(null);
        }
    }

    updateScore(playerIndex: number) {
        this.score[playerIndex]++;
        if (this.score[playerIndex] === MAX_SCORE)
            this.end();
    }

    async sendResult() {
        try {
            const response = await fetch("/api/v1/user/matches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: userData!.id,
                    gameMode: this.gameMode,
                    player1: this.player1,
                    player2: this.player2,
                    score: this.score,
                    winner: this.winner
                }),
            });

            if (!response.ok) throw new Error("Failed to send match result");
        } catch (err) {
            console.error("Send error:", err);
        }
    }
}
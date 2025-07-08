import { MAX_SCORE } from "./config.js";
import { setMatch, gameStates, animationId, setAnimationId } from "./state.js";
import { gameLoop, initGame } from "./game.js";
import { renderEndMenu, renderMatchIntro, renderPauseMenu } from "./render.js";

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
        
        if (!!localStorage.getItem("token"))
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
        let route: string;
        if (this.gameMode === 0)
            route = "/api/v1/user/singleplayer";
        else if (this.gameMode === 1)
            route = "/api/v1/user/multiplayer";
        else if (this.gameMode === 2)
            route = "/api/v1/user/tournament";
        else
            return console.log("gamemode do not exist");
        try {
            const response = await fetch(route, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: localStorage.getItem("token"),
                    player2: this.player2,
                    score1: this.score[1],
                    score2: this.score[2],
                    userWin: this.winner === this.player1 ? true : false
                }),
            });

            if (!response.ok) throw new Error("Failed to send match result");
        } catch (err) {
            console.error("Send error:", err);
        }
    }
}
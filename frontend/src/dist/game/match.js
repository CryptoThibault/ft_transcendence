var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MAX_SCORE } from "./config.js";
import { setMatch, gameStates, animationId, setAnimationId } from "./state.js";
import { gameLoop, initGame } from "./game.js";
import { renderEndMenu, renderMatchIntro, renderPauseMenu } from "./render.js";
import { userData } from "../views/login.js";
export class Match {
    constructor(gameMode, player1, player2) {
        this.gameMode = gameMode;
        this.player1 = player1;
        this.player2 = player2;
        this.winner = null;
        this.score = [0, 0];
    }
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
        if (this.onEnd)
            this.onEnd();
    }
    stop() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            setAnimationId(null);
        }
    }
    updateScore(playerIndex) {
        this.score[playerIndex]++;
        if (this.score[playerIndex] === MAX_SCORE)
            this.end();
    }
    sendResult() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("/api/v1/user/matches", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: userData.id,
                        gameMode: this.gameMode,
                        player1: this.player1,
                        player2: this.player2,
                        score: this.score,
                        winner: this.winner
                    }),
                });
                if (!response.ok)
                    throw new Error("Failed to send match result");
            }
            catch (err) {
                console.error("Send error:", err);
            }
        });
    }
}

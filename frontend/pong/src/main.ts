import { Match } from "./match.js"
import { Tournament } from "./tournament.js"

document.fonts.load("16px 'Press Start 2P'");
window.onload = () => {
    //const match: Match = new Match(0, "ME", "AI"); // Singleplayer
    //const match: Match = new Match(1, "rodrigo", "thibault"); // Multiplayer
    //match.start();
    const tournament: Tournament = new Tournament(["linh", "berke", "rodrigo", "thibault"]);
    tournament.startNextMatch();
}
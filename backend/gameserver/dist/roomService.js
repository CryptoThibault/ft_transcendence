import { rooms } from "./server.js";
import { gameLoop } from "./serversidegame/game.js";
function generateRoomName(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomName = '';
    for (let i = 0; i < length; i++) {
        roomName += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return roomName;
}
export function createRoom() {
    const roomName = generateRoomName();
    rooms.set(roomName, new Set());
    return roomName;
}
export default function newPlayerJoined(playerSocket, io, roomName) {
    if (!rooms.has(roomName)) {
        console.log("User tried to connect to a non-existing room");
        return;
    }
    else {
        if (rooms.get(roomName).size == 2) {
            io.to(playerSocket.id).emit("error", { message: "Room is full" });
            playerSocket.disconnect();
            return;
        }
    }
    const size = rooms.get(roomName).size;
    const newPlayer = { socket: playerSocket, playerIndex: size, isOnline: true };
    rooms.get(roomName).add(newPlayer);
    if (rooms.get(roomName).size == 2) {
        for (const player of rooms.get(roomName)) {
            io.to(player.socketid).emit("ready");
            gameLoop();
        }
    }
    else {
        console.log("ROOM SIZE IS " + rooms.get(roomName).size + " PLAYER SOCKET " + playerSocket.id);
    }
}

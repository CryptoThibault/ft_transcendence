import { Server } from "socket.io";
import newPlayerJoined from "./roomService.js";
import { keys } from "./serversidegame/state.js";
import { rooms } from "./server.js";
let io;
export function initSocket(fastify) {
    io = new Server(fastify.server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    io.on("connection", (socket) => {
        console.log("New client connected");
        socket.on("join-room", (val) => {
            newPlayerJoined(socket, io, val);
        });
        socket.on("key-up", (val) => {
            console.log("UP");
            const room = rooms.get("first");
            for (const player of room) {
                if (socket.id == player.socketid) {
                    if (player.playerIndex == false) {
                        keys.w = val;
                    }
                    else {
                        keys.Up = val;
                    }
                }
            }
        });
        socket.on("key-down", (val) => {
            console.log("DOWN");
            const room = rooms.get("first");
            for (const player of room) {
                if (socket.id == player.socketid) {
                    if (player.playerIndex == false) {
                        keys.s = val;
                    }
                    else {
                        keys.Down = val;
                    }
                }
            }
        });
    });
}
export { io };

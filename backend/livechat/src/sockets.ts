import { Server, Socket } from "socket.io"
import { FastifyInstance } from "fastify"
import { sendMessageToSocket } from "./services/msgService"
import { getUsernameFromToken } from "./services/auth"

export const onlineUserSockets = new Map<string, Socket>

export async function initSockets(fastify: FastifyInstance)
{
    const io = new Server(fastify.server, {
        path: "/socket.io/",
        cors: 
        {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on('connection', (socket) => {
        console.log("Connection received!");
        const token = socket.handshake.auth.token;
        const userId = getUsernameFromToken(token);
        onlineUserSockets.set(userId, socket)
        console.log(userId + ' (' + onlineUserSockets.get(userId) + ') ' + 'connected');
        socket.join(userId);
        socket.on('disconnect', () => 
        {
            console.log(userId + ' (' + onlineUserSockets.get(userId) + ') ' + 'disconnected');
            onlineUserSockets.delete(userId)
        })
        socket.on('emit-chat-message', async ({ to, msg }) => {
            console.log(userId + " " + to + " " + msg);
            try {
                await sendMessageToSocket(io,userId,to,msg)
            } catch (error) {
                console.log(error)
            }

        });
    });
}
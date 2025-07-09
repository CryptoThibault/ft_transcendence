import { Server, Socket } from "socket.io"
import { FastifyInstance } from "fastify"
import { sendMessageToSocket } from "./services/msgService"
import { getUserFromToken } from "./services/auth"

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
    io.on('connection', (socket: Socket) => {
        console.log("Connection received!");
        const token = socket.handshake.auth.token;
        let userId = ""
        let userName = ""
        try {
            const user: {userId: string, userName:string} = getUserFromToken(token);
            userId = user.userId
            userName = user.userName
            onlineUserSockets.set(userName, socket)
            console.log(userName + ' (' + onlineUserSockets.get(userId) + ') ' + 'connected');
            socket.join(userName);
            socket.on('disconnect', () => 
            {
                console.log(userName + ' (' + onlineUserSockets.get(userName) + ') ' + 'disconnected');
                onlineUserSockets.delete(userId)
            })
            socket.on('emit-chat-message', async ({to, msg}: {to: string, msg: string}) => {
                console.log(userName + " " + to + " " + msg);
                try {
                    await sendMessageToSocket(io,userName,to,msg)
                } catch (error) {
                    console.log(error)
                }

            });
        } catch (error) {
            console.log(error)
        }
    });
}
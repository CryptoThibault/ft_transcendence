import { Server } from "socket.io"
import { FastifyInstance } from "fastify"
import newPlayerJoined from "./roomService.js"
import { keys, rightPaddle } from "./serversidegame/state.js"
import { rooms } from "./server.js"
 
let io: Server



export function initSocket(fastify: FastifyInstance)
{
    io = new Server(fastify.server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
    console.log("New client connected")
    
    socket.on("join-room", (val: string) => {
        
        newPlayerJoined(socket, io, val)
    })

        socket.on("key-up", (val: any) => {
        console.log("UP")
            const room = rooms.get("first")
            for (const player of room)
            {
                if (socket.id == player.socketid)
                {
                    if (player.playerIndex == false)
                    {
                        keys.w = val
                    }
                    else
                    {
                        keys.Up = val
                    }
                }
            }
        })
        socket.on("key-down", (val: any) => {
        console.log("DOWN")
            const room = rooms.get("first")
            for (const player of room)
            {
                if (socket.id == player.socketid)
                {
                    if (player.playerIndex == false)
                    {
                        keys.s = val
                    }
                    else
                    {
                        keys.Down = val
                    }
                }
            }
        })
    })
}
export {io}
import { Server, Socket } from "socket.io";
import { runDbAsync } from "../databaseServices";
import { CommandResult } from "../interfaces/types"
import { blockUser, msgCmdCheck, unblockUser } from "./msgCmdServices"
import { isBlocked } from "./databaseService";
import { onlineUserSockets } from "../sockets";


export async function sendMessageToSocket(io: Server, userId: string, to: string, msg: string)
{
    const targetSocket: Socket | undefined = onlineUserSockets.get(to);
    const isBlock = await isBlocked(userId, to)
    if (isBlock)
        return;
    if (targetSocket)
    {
        const cmdResult: CommandResult = await msgCmdCheck(msg,userId,to)
        if (cmdResult.error)
        {
            console.error("there is an error");
            console.log(cmdResult.error);
            throw cmdResult.error;
        }
        if (!cmdResult.isCommand)
        {
            io.to(targetSocket.id).emit('get-chat-message', {
            from: userId,
            msg: msg
            });
        }
        else
        {
            const isBlock = await isBlocked(userId, to)
            io.to(targetSocket.id).emit('emit-invite-message', {
            from: userId,
            roomName: cmdResult.replyMessage
            });
            io.to(onlineUserSockets.get(userId)!.id).emit('emit-invite-message', {
            from: "server",
            roomName: cmdResult.replyMessage
            });
        }

    }
        //TO-DO database check if user exists
        try {
        await runDbAsync(`INSERT INTO messages (sender_id, receiver_id, message)
                        VALUES (?, ?, ?)`,[userId,to,msg]);
        console.log("Message stored in DB");
        }   catch (err) {
        console.error("Failed to insert message:", err);
        throw err
    }
}

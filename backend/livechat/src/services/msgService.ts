import { Server, Socket } from "socket.io";
import { runDbAsync } from "../databaseServices";
import { CommandResult } from "../interfaces/types"
import { blockUser, msgCmdCheck, unblockUser } from "./msgCmdServices"
import { isBlocked } from "./databaseService";
import { onlineUserSockets } from "../sockets";
import { gameService } from "./gameService";


export async function sendMessageToSocket(io: Server, userId: string, to: string, msg: string)
{
    console.log(`sendMessageToSocket called: userId="${userId}", to="${to}", msg="${msg}"`);
    const targetSocket: Socket | undefined = onlineUserSockets.get(to);
    const isBlock = await isBlocked(userId, to)
    console.log(`Target socket exists: ${!!targetSocket}, isBlocked: ${isBlock}`);
    
    if (targetSocket)
    {
        const cmdResult: CommandResult = await msgCmdCheck(msg,userId,to)
        console.log(`Command result:`, cmdResult);
        
        if (isBlock)
            return
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
            console.log(`Processing command: ${msg}`);
            if (msg.startsWith('/invite')) {
                console.log(`Handling /invite command`);
                
                if (cmdResult.error) {
                    const senderSocket = onlineUserSockets.get(userId);
                    if (senderSocket) {
                        io.to(senderSocket.id).emit('invitation-error', {
                            message: cmdResult.replyMessage
                        });
                    }
                } else {
                    io.to(targetSocket.id).emit('game-invitation-with-buttons', {
                        from: userId,
                        invitationId: cmdResult.invitationId,
                        message: `${userId} invited you to play a game!`,
                        roomName: cmdResult.replyMessage.split('Room: ')[1] || 'Unknown Room'
                    });
                    
                    const senderSocket = onlineUserSockets.get(userId);
                    if (senderSocket) {
                        io.to(senderSocket.id).emit('get-chat-message', {
                            from: 'System',
                            msg: cmdResult.replyMessage
                        });
                    }
                    
                    setTimeout(() => {
                        const invitation = gameService.getInvitation(cmdResult.invitationId!);
                        if (invitation && invitation.status === 'pending') {
                            gameService.removeInvitation(cmdResult.invitationId!);
                            console.log(`Auto-deleted invitation ${cmdResult.invitationId} after 5 seconds`);
                            
                            const targetSocket = onlineUserSockets.get(to);
                            const senderSocket = onlineUserSockets.get(userId);
                            
                            if (targetSocket) {
                                io.to(targetSocket.id).emit('invitation-expired', {
                                    invitationId: cmdResult.invitationId,
                                    message: 'Game invitation expired'
                                });
                            }
                            
                            if (senderSocket) {
                                io.to(senderSocket.id).emit('get-chat-message', {
                                    from: 'System',
                                    msg: 'Game invitation expired after 5 seconds'
                                });
                            }
                        }
                    }, 5000);
                }
            }
            else if (msg.startsWith('/accept') || msg.startsWith('/decline')) {
                console.log(`Handling /accept or /decline command`);
                const invitation = gameService.getInvitation(cmdResult.invitationId!);
                if (invitation) {
                    const otherUser = invitation.from === userId ? invitation.to : invitation.from;
                    const otherSocket = onlineUserSockets.get(otherUser);
                    
                    if (otherSocket) {
                        io.to(otherSocket.id).emit('game-invitation-response', {
                            from: userId,
                            invitationId: cmdResult.invitationId,
                            accepted: msg.startsWith('/accept'),
                            message: cmdResult.replyMessage
                        });
                    }
                    
    
                    const responderSocket = onlineUserSockets.get(userId);
                    if (responderSocket) {
                        io.to(responderSocket.id).emit('get-chat-message', {
                            from: 'System',
                            msg: cmdResult.replyMessage
                        });
                    }
                    if (msg.startsWith('/accept')) {
                        const gameInfo = JSON.stringify({
                            type: 'accepted_game',
                            roomName: invitation.roomName,
                            player1: invitation.from,
                            player2: invitation.to,
                            acceptedBy: userId,
                            timestamp: new Date().toISOString()
                        });
                        
                        await runDbAsync(`INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`, 
                            [invitation.to, invitation.from, gameInfo]);
                        startGame(invitation.roomName, invitation.from, invitation.to, io);
                    }
                }
            }
            else {
                const senderSocket = onlineUserSockets.get(userId);
                if (senderSocket) {
                    io.to(senderSocket.id).emit('get-chat-message', {
                        from: 'System',
                        msg: cmdResult.replyMessage
                    });
                }
            }
        }
    }
        try {
        await runDbAsync(`INSERT INTO messages (sender_id, receiver_id, message)
                        VALUES (?, ?, ?)`,[userId,to,msg]);
        console.log("Message stored in DB");
        }   catch (err) {
        console.error("Failed to insert message:", err);
        throw err
    }
}

async function startGame(roomName: string, player1: string, player2: string, io: Server) {
    try {
        const player1Socket = onlineUserSockets.get(player1);
        const player2Socket = onlineUserSockets.get(player2);
        
        if (player1Socket) {
            io.to(player1Socket.id).emit('game-start', {
                roomName: roomName,
                opponent: player2,
                message: `Game starting! Room: ${roomName}`
            });
        }
        
        if (player2Socket) {
            io.to(player2Socket.id).emit('game-start', {
                roomName: roomName,
                opponent: player1,
                message: `Game starting! Room: ${roomName}`
            });
        }
        
        console.log(`Game started in room ${roomName} between ${player1} and ${player2}`);
    } catch (error) {
        console.error('Failed to start game:', error);
    }
}

import { Server, Socket } from "socket.io"
import { FastifyInstance } from "fastify"
import { sendMessageToSocket } from "./services/msgService"
import { getUserFromToken } from "./services/auth"
import { acceptGameInvitation, declineGameInvitation } from "./services/msgCmdServices"
import { gameService } from "./services/gameService"
import { runDbAsync } from "./databaseServices"

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
                
                // Handle game disconnection - declare the other player as winner
                gameService.handlePlayerDisconnection(userName, io);
            })
            socket.on('emit-chat-message', async ({to, msg}: {to: string, msg: string}) => {
                console.log(userName + " " + to + " " + msg);
                try {
                    await sendMessageToSocket(io,userName,to,msg)
                } catch (error) {
                    console.log(error)
                }

            });

            // Handle game invitation responses via buttons
            socket.on('accept-game-invitation', async ({invitationId}: {invitationId: string}) => {
                console.log(`${userName} accepting invitation ${invitationId}`);
                try {
                    const result = await acceptGameInvitation(invitationId, userName);
                    if (result.error) {
                        console.error('Error accepting invitation:', result.error);
                        return;
                    }
                    
                    // Notify both users about the acceptance
                    const invitation = gameService.getInvitation(invitationId);
                    if (invitation) {
                        const otherUser = invitation.from === userName ? invitation.to : invitation.from;
                        const otherSocket = onlineUserSockets.get(otherUser);
                        
                        if (otherSocket) {
                            io.to(otherSocket.id).emit('game-invitation-response', {
                                from: userName,
                                invitationId: invitationId,
                                accepted: true,
                                message: `${userName} accepted the game invitation!`
                            });
                        }
                        
                        const gameInfo = JSON.stringify({
                            type: 'accepted_game',
                            roomName: invitation.roomName,
                        });
                        // Store for both users in the conversation
                        await runDbAsync(`INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`, 
                            [userName, invitation.from, gameInfo]);
                        await runDbAsync(`INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`, 
                            [invitation.from, userName, gameInfo]);
                        startGame(invitation.roomName, invitation.from, invitation.to, io);
                        // Start the multiplayer game
                        gameService.startGame(invitation.roomName, invitation.from, invitation.to, io);
                    }
                } catch (error) {
                    console.log(error);
                }
            });

            socket.on('decline-game-invitation', async ({invitationId}: {invitationId: string}) => {
                console.log(`${userName} declining invitation ${invitationId}`);
                try {
                    const result = await declineGameInvitation(invitationId, userName);
                    if (result.error) {
                        console.error('Error declining invitation:', result.error);
                        return;
                    }
                    
                    // Notify the sender about the decline
                    const invitation = gameService.getInvitation(invitationId);
                    if (invitation) {
                        const senderSocket = onlineUserSockets.get(invitation.from);
                        if (senderSocket) {
                            io.to(senderSocket.id).emit('game-invitation-response', {
                                from: userName,
                                invitationId: invitationId,
                                accepted: false,
                                message: `${userName} declined the game invitation.`
                            });
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            });

            // Multiplayer game events
            socket.on('join-game-room', ({ roomName }: { roomName: string }) => {
                console.log(`${userName} attempting to join game room ${roomName}`);
                
                // Check if player is authorized to join this room
                if (!gameService.isPlayerAuthorizedForRoom(userName, roomName)) {
                    console.log(`Unauthorized access attempt: ${userName} tried to join room ${roomName}`);
                    socket.emit('game-access-denied', {
                        message: 'You are not authorized to join this game room.'
                    });
                    return;
                }
                
                console.log(`${userName} authorized to join game room ${roomName}`);
                socket.join(roomName);
                
                // Send current game state to the joining player
                const gameState = gameService.getGameState(roomName);
                if (gameState) {
                    socket.emit('game-state-update', gameState);
                }
            });

            socket.on('player-input', ({ roomName, key, pressed }: { roomName: string; key: string; pressed: boolean }) => {
                // Check if player is authorized for this room
                if (!gameService.isPlayerAuthorizedForRoom(userName, roomName)) {
                    console.log(`Unauthorized input attempt: ${userName} tried to send input to room ${roomName}`);
                    return;
                }
                
                console.log(`${userName} input in room ${roomName}: ${key} ${pressed ? 'pressed' : 'released'}`);
                console.log(`Player ${userName} sending input: ${key} = ${pressed}`);
                gameService.updatePlayerInput(roomName, userName, key, pressed);
            });

            socket.on('request-game-state', ({ roomName }: { roomName: string }) => {
                // Check if player is authorized for this room
                if (!gameService.isPlayerAuthorizedForRoom(userName, roomName)) {
                    console.log(`Unauthorized state request: ${userName} tried to get state for room ${roomName}`);
                    return;
                }
                
                const gameState = gameService.getGameState(roomName);
                if (gameState) {
                    socket.emit('game-state-update', gameState);
                }
            });

            socket.on('leave-game-room', ({ roomName }: { roomName: string }) => {
                console.log(`${userName} leaving game room ${roomName}`);
                socket.leave(roomName);
                
                // Remove player from game room and handle game end if needed
                gameService.removePlayerFromRoom(roomName, userName, io);
            });

            socket.on('request-player-position', ({ roomName }: { roomName: string }) => {
                // Check if player is authorized for this room
                if (!gameService.isPlayerAuthorizedForRoom(userName, roomName)) {
                    console.log(`Unauthorized position request: ${userName} tried to get position for room ${roomName}`);
                    return;
                }
                
                console.log(`${userName} requesting player position for room ${roomName}`);
                const gameState = gameService.getGameState(roomName);
                if (gameState) {
                    const isLeftPlayer = userName === gameState.player1;
                    socket.emit('player-position', { isLeftPlayer });
                    console.log(`${userName} is ${isLeftPlayer ? 'left' : 'right'} player`);
                }
            });
        } catch (error) {
            console.log(error)
        }
    });
}

async function startGame(roomName: string, player1: string, player2: string, io: Server) {
    try {
        // Notify both players that game is starting
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
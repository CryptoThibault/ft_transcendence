import { Socket } from "socket.io";

export interface RemotePlayer
{
    socket: Socket;
    playerIndex: number;
    isOnline: boolean;
}
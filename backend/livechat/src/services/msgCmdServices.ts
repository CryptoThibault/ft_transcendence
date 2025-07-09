import { getDbAsync, runDbAsync } from "../databaseServices";
import { CommandResult } from "../interfaces/types";

export async function blockUser(blocker_user: string, blocked_user: string): Promise <CommandResult>
{
    const blocked = await getDbAsync(`SELECT * FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?`, [blocker_user,blocked_user]);
    if (!blocked)
    {
        try {
            await runDbAsync(`INSERT INTO blocked_users (blocked_id, blocker_id) VALUES (?,?)`, [blocked_user, blocker_user])
            return ({error:null, replyMessage: "User is succesfully blocked.",  isCommand: true})
        } catch (error) {
            return ({error: error as Error, replyMessage: "Error occured while inserting blocked_users", isCommand: true})
        }
    }
    else
    {
        return ({error:null, replyMessage: "User is already blocked", isCommand: true})
    }
}

export async function unblockUser(blocker_user: string, blocked_user: string): Promise <CommandResult>
{
    const blocked = await getDbAsync(`SELECT * FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?`, [blocker_user,blocked_user]);
    if (blocked)
    {
        try {
            await runDbAsync(`DELETE FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?`, [blocker_user, blocked_user])
            console.log("user is succesfully UNBLOCKED")
            return ({error:null, replyMessage: "User is succesfully unblocked.", isCommand: true})
        } catch (error) {
            console.error("USER COULDNT UNBLOCKED")
            return ({error: error as Error, replyMessage: "Error occured while deleting blocked_users",  isCommand: true})
        }
    }
    else
    {
        return ({error:null, replyMessage: "User is not blocked",  isCommand: true})
    }
}

export async function createRoomInRoomService(): Promise<CommandResult> 
{
    try {
    const res = await fetch("http://localhost:6001/create-room", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    //TO-DO: if(!res.ok)
    const data = await res.json();
    return {
      error: null,
      replyMessage: data.roomName,
      isCommand: true,
    };
    } catch (error: any) {
        return {
      error: error,
      replyMessage: "Error",
      isCommand: true,
    };
    }
}

export async function msgCmdCheck(msg: string, sender_id: string, receiver_id: string): Promise<CommandResult>
{
    if (msg.startsWith('/block'))
    {
        const result: CommandResult = await blockUser(sender_id, receiver_id)
        return result;
    }
    else if (msg.startsWith('/pardon'))
    {
        const result: CommandResult = await unblockUser(sender_id, receiver_id)
        result.isCommand = true;
        return result;
    }
    else if (msg.startsWith('/invite'))
    {
        const result = createRoomInRoomService()
        return result;
    }
    else
    {
        return ({error:null,replyMessage: "It is not a command", isCommand: false})
    }
}
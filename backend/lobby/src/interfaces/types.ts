export interface CommandResult {
  error: Error | null;
  replyMessage: string;
}

export interface ILobby
{
  id: number;
  name: string;
  capacity: number;
  creator_id: number;
}
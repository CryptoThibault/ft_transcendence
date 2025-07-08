export interface CommandResult {
  error: Error | null;
  replyMessage: string;
  isCommand: boolean;
}


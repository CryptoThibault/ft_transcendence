export const joinLobbySchema = {
  body: {
    type: 'object',
    required: ['lobby_id', 'user_id'],
    properties: {
      lobby_id: { type: 'integer' },
      user_id: { type: 'integer' },
    },
  },
};

export interface JoinLobbyBody {
  lobby_id: number;
  user_id: number;
}
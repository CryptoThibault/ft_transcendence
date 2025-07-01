export const createLobbySchema = {
  body: {
    type: 'object',
    required: ['name', 'capacity','creator_id'],
    properties: {
      name: { type: 'string' },
      capacity: { type: 'integer' },
      creator_id: { type: 'integer' },
    },
  },
};

export interface CreateLobbyBody {
    name: string,
    capacity: number,
    creator_id: number
}
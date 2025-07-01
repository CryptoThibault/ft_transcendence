"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinLobbySchema = void 0;
exports.joinLobbySchema = {
    body: {
        type: 'object',
        required: ['lobby_id', 'user_id'],
        properties: {
            lobby_id: { type: 'integer' },
            user_id: { type: 'integer' },
        },
    },
};

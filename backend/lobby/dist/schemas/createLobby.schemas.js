"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLobbySchema = void 0;
exports.createLobbySchema = {
    body: {
        type: 'object',
        required: ['name', 'capacity', 'creator_id'],
        properties: {
            name: { type: 'string' },
            capacity: { type: 'integer' },
            creator_id: { type: 'integer' },
        },
    },
};

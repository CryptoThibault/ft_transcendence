"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lobbyService_1 = require("./lobbyService");
const joinLobby_schemas_1 = require("./schemas/joinLobby.schemas");
const createLobby_schemas_1 = require("./schemas/createLobby.schemas");
const lobbiesRoutes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    //to create lobbies, requries lobby name, capacity, user (admin)
    fastify.post('/create-lobby', {
        schema: createLobby_schemas_1.createLobbySchema,
    }, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, capacity, creator_id } = request.body;
        try {
            yield (0, lobbyService_1.createLobby)(name, capacity, creator_id);
            reply.send({ message: "Lobby created, creator added", name, capacity, creator_id });
        }
        catch (error) {
            reply.code(error.statusCode || 500).send({ message: error.message });
        }
    }));
    fastify.post('/join-lobby', {
        schema: joinLobby_schemas_1.joinLobbySchema,
    }, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { lobby_id, user_id } = request.body;
        try {
            yield (0, lobbyService_1.joinLobby)(user_id, lobby_id);
            reply.send({ message: "User succesfully joined to lobby", user_id, lobby_id });
        }
        catch (error) {
            reply.code(error.statusCode || 500).send({ message: error.message });
        }
    }));
    fastify.get('/get-lobby/:lobbyId', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { lobby_id } = request.params;
        const lobbyIdInt = parseInt(lobby_id, 10);
        try {
            const lobbyInfos = yield (0, lobbyService_1.getLobbies)(lobbyIdInt);
            reply.send(lobbyInfos);
        }
        catch (error) {
            reply.code(500).send({ message: error.message });
        }
    }));
});
exports.default = lobbiesRoutes;

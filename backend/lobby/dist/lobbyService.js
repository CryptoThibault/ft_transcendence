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
exports.getLobbies = getLobbies;
exports.createLobby = createLobby;
exports.joinLobby = joinLobby;
const databaseServices_1 = require("./databaseServices");
function getLobbies(lobby_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lobby = yield (0, databaseServices_1.findAllDbAsync)(`SELECT * FROM lobbies WHERE (id = ?)`, [lobby_id]);
            if (!lobby) {
                throw { statusCode: 404, message: "Lobby is not found" };
            }
            const usersInLobby = yield (0, databaseServices_1.findAllDbAsync)(`SELECT * FROM user_lobbies WHERE (lobby_id = ?)`, [lobby_id]);
            return { lobby, users: usersInLobby };
        }
        catch (error) {
            throw { statusCode: 500, message: "Database error retrieving lobby or users", details: error };
        }
    });
}
function getUsersLobbies(user_id) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const row = yield (0, databaseServices_1.getDbAsync)(`SELECT * FROM user_lobbies WHERE (user_id = ?)`, [user_id]);
            resolve(row);
        }
        catch (error) {
            reject(error);
        }
    }));
}
function createLobby(name, capacity, creator_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const userlobby = yield getUsersLobbies(creator_id);
        if (userlobby) {
            throw { statusCode: 500, message: "Database error creating lobby or user_lobby, user is already in another lobby" };
        }
        try {
            const lobbyID = yield (0, databaseServices_1.runDbAsync)('INSERT INTO lobbies (name, capacity, creator_id) VALUES (?,?,?)', [name, capacity, creator_id]);
            yield (0, databaseServices_1.runDbAsync)(`INSERT INTO user_lobbies (user_id, lobby_id) VALUES (?,?)`, [creator_id, lobbyID]);
        }
        catch (error) {
            throw { statusCode: 500, message: "Database error creating lobby or user_lobby", details: error };
        }
    });
}
function joinLobby(user_id, lobby_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const userlobby = yield getUsersLobbies(user_id);
        if (userlobby) {
            throw { statusCode: 500, message: "Database error creating lobby or user_lobby, user is already in another lobby" };
        }
        try {
            yield (0, databaseServices_1.runDbAsync)(`INSERT INTO user_lobbies (user_id,lobby_id) VALUES (?,?)`, [user_id, lobby_id]);
        }
        catch (error) {
            if (error.statusCode && error.message) {
                throw error;
            }
            throw { statusCode: 500, message: "Database error while joining lobby", details: error };
        }
    });
}

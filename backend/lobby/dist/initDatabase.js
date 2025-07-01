"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
//TO-DO delete
sqlite3_1.default.verbose();
const dbPath = path_1.default.resolve(__dirname, '../database/lobby.db.sqlite');
exports.db = new sqlite3_1.default.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    }
    else {
        console.log('Connected to SQLite database.');
    }
    exports.db.run(`CREATE TABLE IF NOT EXISTS lobbies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, capacity INTEGER, creator_id INTEGER)`, (err) => {
        if (err)
            console.log('Error creating lobbies table');
        else
            console.log('lobbies table created succesfully');
    });
    exports.db.run(`CREATE TABLE IF NOT EXISTS user_lobbies (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, lobby_id INTEGER)`, (err) => {
        if (err)
            console.log('Error creating user_lobbies table');
        else
            console.log('user_lobbies table created succesfully');
    });
});

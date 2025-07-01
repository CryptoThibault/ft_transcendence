import sqlite3 from 'sqlite3';
import path from 'path';

//TO-DO delete
sqlite3.verbose();

export type Database = sqlite3.Database;

const dbPath = path.resolve(__dirname, '../database/lobby.db.sqlite');
export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database.');
    }

    db.run(`CREATE TABLE IF NOT EXISTS lobbies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, capacity INTEGER, creator_id INTEGER)`, (err) => {
        if (err)
            console.log('Error creating lobbies table')
        else
            console.log('lobbies table created succesfully')
    })

    db.run(`CREATE TABLE IF NOT EXISTS user_lobbies (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, lobby_id INTEGER)`, (err) => {
        if (err)
            console.log('Error creating user_lobbies table')
        else
            console.log('user_lobbies table created succesfully')
    })
});

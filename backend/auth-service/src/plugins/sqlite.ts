// backend/auth-service/src/plugins/sqlite.ts
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../database/auth.sqlite');

let db: Database.Database | null = null;

export const connectToDatabase = () => {
	if (db)
		return db;
	try {
		db = new Database(dbPath);
		db.pragma('journal_mode = WAL');
		console.log(`Connected to Auth database at: ${dbPath}`);
		db.exec(`
			CREATE TABLE IF NOT EXISTS authUser (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT(20) NOT NULL,
				email TEXT UNIQUE NOT NULL,
				password TEXT NOT NULL,
				twoFactorEnabled BOOLEAN DEFAULT 0 NOT NULL,
				twoFactorSecret TEXT,
				createdAt INTEGER DEFAULT (CAST(STRFTIME('%s', 'now') AS INTEGER)) NOT NULL,
				updatedAt INTEGER DEFAULT (CAST(STRFTIME('%s', 'now') AS INTEGER)) NOT NULL
			);
		`);
		db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_authUser_email ON authUser(email);`);
		return db;
	} catch (err) {
		console.error('Failed to connect to SQLite database:', err);
		process.exit(1);
	}
};

export const getDb = () => {
	if (!db)
		throw new Error('Database not connected. Call connectToDatabase first.');
	return db;
};

process.on('exit', () => {
	if (db) {
		db.close();
		console.log('Auth database connection closed.');
	}
});

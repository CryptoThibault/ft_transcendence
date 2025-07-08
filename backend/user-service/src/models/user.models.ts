//backend/user-serrvice/src/models./user.models.ts
import { dbPromise } from '../plugins/sqlite.js';

export interface UserData {
	id?: number;
	name: string;
	email: string;
	avatar?: string | null;
	wins?: number;
	losses?: number;
	onlineStatus?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export class User {
	/**
	* Initializes the 'users' table in the database if it doesn't exist.
	*/
	static async createTable() {
		const db = await dbPromise;
		await db.run(`
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				email TEXT NOT NULL UNIQUE,
				avatar TEXT DEFAULT 'default-avatar.png',
				wins INTEGER DEFAULT 0,
				losses INTEGER DEFAULT 0,
				onlineStatus BOOLEAN DEFAULT false,
				createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
				updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
			);
		`);
		console.log('User table created or already exists.');
	}
	/**
	* Creates a new user record in the database.
	* @param data The UserData object for the new user.
	* @returns The created UserData object with ID and timestamps.
	*/
	static async create(data: UserData): Promise<UserData> {
		const db = await dbPromise;
		const now = new Date().toISOString();

		const result = await db.run(
			`INSERT INTO users (name, email, avatar, wins, losses, onlineStatus, createdAt, updatedAt)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			data.name,
			data.email,
			data.avatar ?? 'default-avatar.png',
			data.wins ?? 0,
			data.losses ?? 0,
			data.onlineStatus ?? false,
			now,
			now
		);
		return { id: result.lastID, ...data, createdAt: now, updatedAt: now };
	}
	/**
	* Finds a user by their ID, returning a sanitized version of the data.
	* @param id The ID of the user to find.
	* @returns The sanitized UserData object or null if not found.
	*/
	static async findById(id: number): Promise<Omit<UserData, 'email'> | null> {
		const user = await User._findByIdRaw(id);
		return user ? User.sanitize(user) : null;
	}
	/**
	* Internal method to find a user by ID, returning the raw data (including all fields).
	* Used internally when full data is needed (e.g., for specific operations).
	* @param id The ID of the user to find.
	* @returns The raw UserData object or null if not found.
	*/
	static async _findByIdRaw(id: number): Promise<UserData | null> {
		const db = await dbPromise;
		const user = await db.get(`SELECT * FROM users WHERE id = ?`, id);
		return user ? (user as UserData) : null;
	}
	/**
	* Finds a user by their email address.
	* @param email The email of the user to find.
	* @returns The UserData object or null if not found. Note: This returns raw data.
	*/
	static async findByEmail(email: string): Promise<UserData | null> {
		const db = await dbPromise;
		const user = await db.get(`SELECT * FROM users WHERE email = ?`, email);
		return user ? (user as UserData) : null;
	}
	/**
	* Finds a user by their ID, returning full raw data including email.
	* @param id The ID of the user to find.
	* @returns The full UserData object or null if not found.
	*/
	static async findByIdWithEmail(id: number): Promise<UserData | null> {
		const db = await dbPromise;
		const user = await db.get(`SELECT * FROM users WHERE id = ?`, id);
		return user ? (user as UserData) : null;
	}
	
	/**
    * Retrieves all users from the database, excluding their email addresses.
    * @returns An array of sanitized UserData objects.
    */
    static async findAll(): Promise<Omit<UserData, 'email'>[]> {
        const db = await dbPromise;
        const users = await db.all(`SELECT * FROM users`);
        return users.map((user: UserData) => User.sanitize(user as UserData));
    }
	
	/**
	* Updates a user record by ID with partial data.
	* @param id The ID of the user to update.
	* @param data The partial UserData object with fields to update.
	* @returns True if the user was updated, false otherwise.
	*/
	static async update(id: number, data: Partial<UserData>): Promise<boolean> {
		const db = await dbPromise;
		const now = new Date().toISOString();
		const updates: string[] = [];
		const values: (string | number | boolean | null)[] = [];

		if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
		if (data.email !== undefined) { updates.push('email = ?'); values.push(data.email); }
		if (data.avatar !== undefined) { updates.push('avatar = ?'); values.push(data.avatar); }
		if (data.wins !== undefined) { updates.push('wins = ?'); values.push(data.wins); }
		if (data.losses !== undefined) { updates.push('losses = ?'); values.push(data.losses); }
		if (data.onlineStatus !== undefined) { updates.push('onlineStatus = ?'); values.push(data.onlineStatus); }
		if (updates.length === 0)
			return false;
		updates.push('updatedAt = ?');
		values.push(now);
		const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
		values.push(id);
		const result = await db.run(query, ...values);
		// adding this 
		console.log('DEBUG (User Model): User.update SQL Query:', query); // ADD THIS LOG
        console.log('DEBUG (User Model): User.update SQL Values:', values); // ADD THIS LOG
		try {
            const result = await db.run(query, ...values);
            console.log(`DEBUG (User Model): User.update result for ID ${id}: changes = ${result?.changes}`); // ADD THIS LOG
            return (result?.changes ?? 0) > 0;
        } catch (error) {
            console.error(`ERROR (User Model): User.update failed for ID ${id}:`, error); // ADD THIS LOG
            throw error;
        }
		//return (result?.changes ?? 0) > 0;
	}
	/**
	* Sanitizes a UserData object by omitting sensitive fields for public use.
	* @param user The UserData object to sanitize.
	* @returns A new object with sensitive fields removed.
	*/
	static sanitize(user: UserData): Omit<UserData, 'email'> {
		const { email, ...sanitized } = user;
		return sanitized;
	}
	static async getLeaderboard(): Promise<Omit<UserData, 'email'>[]> {
		const db = await dbPromise;
		const users = await db.all(
        	`SELECT id, name, avatar, wins, losses FROM users ORDER BY wins DESC, losses ASC`
    	);
    	return users as Omit<UserData, 'email'>[];
	}
	static async delete(id: number): Promise<boolean> {
    	const db = await dbPromise;
    	const result = await db.run(`DELETE FROM users WHERE id = ?`, id);
    	return (result?.changes ?? 0) > 0;
	}
}

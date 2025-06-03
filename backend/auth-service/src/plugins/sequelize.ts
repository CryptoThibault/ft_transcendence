//backend/auth-service/src/plugins/sequelize.ts
import { Sequelize } from 'sequelize';
import { initUserModel } from '../models/auth.models';

export const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './database/auth.sqlite',
	logging: false,
});

export const connectToDatabase = async () => {
	try {
		await sequelize.authenticate();
		initUserModel();
		await sequelize.sync(); // auto-create tables if needed
		console.log('Connected to Auth database');
	} catch (err) {
		console.error('Failed to connect:', err);
		process.exit(1);
	}
};

export default sequelize;
//backend/tournament-service/src/plugins/sequelize.ts
import { Sequelize } from 'sequelize';
import { initTournamentModel } from '../models/tournament.models';
import { initPlayerTournamentModel } from '../models/playerTournament.models';
import { initTournamentMatchModel } from '../models/tournamentMatch.models';
import { initCasualMatchModel } from '../models/casualMatch.models';

export const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './database/tournament.sqlite',
	logging: false,
});

export const connectToDatabase = async () => {
	try {
		await sequelize.authenticate();
		initTournamentModel();
		initPlayerTournamentModel();
		initTournamentMatchModel();
        initCasualMatchModel();;
		await sequelize.sync();
		console.log('Connected to Tournament database');
	} catch (err) {
		console.error('Failed to connect:', err);
		process.exit(1);
	}
};

export default sequelize;

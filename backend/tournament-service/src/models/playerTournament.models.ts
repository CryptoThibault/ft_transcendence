//backend/tournament-service/src/model/playerTournament.models.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../plugins/sequelize';
import { Tournament } from './tournament.models';

export class PlayerTournament extends Model {
	public id!: number;
	public playerId!: number;
	public tournamentId!: number;
}

export const initPlayerTournamentModel = () => {
	PlayerTournament.init({
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		playerId: { type: DataTypes.INTEGER, allowNull: false },
		tournamentId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: Tournament, key: 'id' },
			onDelete: 'CASCADE',
		},
	}, {
		sequelize,
		tableName: 'player_tournaments',
		timestamps: false,
	});
	Tournament.hasMany(PlayerTournament, { foreignKey: 'tournamentId' });
	PlayerTournament.belongsTo(Tournament, { foreignKey: 'tournamentId' });
};

//backend/tournament-service/src/model/tournamentMatch.models.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../plugins/sequelize';
import { Tournament } from './tournament.models';

export enum TournamentMatchState {
	PENDING = 'PENDING',
	COMPLETED = 'COMPLETED',
}

export class TournamentMatch extends Model {
	public id!: number;
	public tournamentId!: number;
	public player1Id!: number;
	public player2Id!: number | null;
	public winnerId!: number | null;
	public roundNumber!: number;
	public matchNumberInRound!: number;
	public score!: string;
	public state!: TournamentMatchState;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

export const initTournamentMatchModel = () => {
	TournamentMatch.init({
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		tournamentId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Tournament, key: 'id' },
			onDelete: 'CASCADE' },
		player1Id: { type: DataTypes.INTEGER, allowNull: false },
		player2Id: { type: DataTypes.INTEGER, allowNull: true },
		winnerId: { type: DataTypes.INTEGER, allowNull: true },
		roundNumber: { type: DataTypes.INTEGER, allowNull: false },
		matchNumberInRound: { type: DataTypes.INTEGER, allowNull: false },
		score: { type: DataTypes.STRING, allowNull: true },
		state: { type: DataTypes.ENUM(...Object.values(TournamentMatchState)), defaultValue: TournamentMatchState.PENDING,
		},
	}, {
		sequelize,
		tableName: 'tournament_matches',
		timestamps: true,
	});

	Tournament.hasMany(TournamentMatch, { foreignKey: 'tournamentId' });
	TournamentMatch.belongsTo(Tournament, { foreignKey: 'tournamentId' });
};

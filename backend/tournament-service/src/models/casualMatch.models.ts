//backend/tournament-service/src/model/casualMatch.models.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../plugins/sequelize';

export enum CasualMatchState {
	PENDING = 'PENDING',
  	IN_PROGRESS = 'IN_PROGRESS',
  	COMPLETED = 'COMPLETED',
  	CANCELLED = 'CANCELLED',
}

export class CasualMatch extends Model {
	public id!: number;
  	public player1_id!: number;
  	public player2_id!: number;
  	public state!: CasualMatchState;
  	public winner_id?: number;
  	public score?: string;
  	public readonly createdAt!: Date;
  	public readonly updatedAt!: Date;
}

export const initCasualMatchModel = () => {
	CasualMatch.init({
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    	player1_id: { type: DataTypes.INTEGER, allowNull: false },
    	player2_id: { type: DataTypes.INTEGER, allowNull: false },
    	state: {
			type: DataTypes.ENUM(...Object.values(CasualMatchState)),
      		allowNull: false,
      		defaultValue: CasualMatchState.PENDING,
    	},
    	winner_id: { type: DataTypes.INTEGER },
    	score: { type: DataTypes.STRING },
  	}, {
    	sequelize,
    	tableName: 'casual_matches',
    	timestamps: true,
  	});
};
 
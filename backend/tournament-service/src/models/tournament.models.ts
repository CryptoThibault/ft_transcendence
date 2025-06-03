//backend/tournament-service/src/model/tournament.models.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../plugins/sequelize';

export class Tournament extends Model {
	public id!: number;
	public name!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

export const initTournamentModel = () => {
	Tournament.init({
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: { type: DataTypes.STRING, allowNull: false },
	}, {
		sequelize,
		tableName: 'tournaments',
		timestamps: true,
	});
};

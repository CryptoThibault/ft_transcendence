//backend/user-serrvice/src/models./user.models.ts
import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../plugins/sequelize';

export class User extends Model {
	public id!: number;
	public name!: string;
	public email!: string;
	public avatar!: string;
	public wins!: number;
	public losses!: number;
	public friends?: User[];
	public onlineStatus!: boolean;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

export const initUserModel = () => {
	User.init({
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: { type: DataTypes.STRING(20), allowNull: false, validate: { 
			len: { args: [2, 20], msg: 'Name must be between 2 and 20 characters' },
			notEmpty: { msg: 'User Name is required' },
		} },
		email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: {
			isEmail: { msg: 'Please enter a valid email address' },
		} },
		avatar: { type: DataTypes.STRING, allowNull: true, defaultValue: 'default-avatar.png',
			validate: { is: /\.(jpe?g|png|webp)$/i },
		},
		wins: { type: DataTypes.INTEGER, defaultValue: 0 },
		losses: { type: DataTypes.INTEGER, defaultValue: 0 },
		onlineStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
	}, {
		sequelize,
		tableName: 'users',
		timestamps: true,
	});
	User.belongsToMany(User, {
		as: 'friends',
		through: 'friendships',
		foreignKey: 'userId',
		otherKey: 'friendId',
	});
};

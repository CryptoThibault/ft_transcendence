// backend/auth-service/src/models/user.models.ts
import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../plugins/sequelize.js';

export class AuthUser extends Model {
	public id!: number;
	public name!: string;
	public email!: string;
	public password!: string;
	/* -------- adding here ----*/
	public twoFactorEnabled!: boolean;
  	public twoFactorSecret!: string | null;
	/* ------------------------- */
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

AuthUser.init({
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  	name: { type: DataTypes.STRING(20), allowNull: false, validate: { len: {
		args: [2, 20], msg: 'Name must be between 2 and 20 characters', },
		notEmpty: { msg: 'User Name is required', }
    	},
  	},
  	email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: {
		isEmail: { msg: 'Please fill a valid email address' }
    	}
  	},
  	password: { type: DataTypes.STRING, allowNull: false, validate: { len: { 
		args: [6, 255], msg: 'Password must be at least 6 characters long' }
    	}
  	},
  	twoFactorEnabled: { type: DataTypes.BOOLEAN, defaultValue: false, },
  	twoFactorSecret: { type: DataTypes.STRING, allowNull: true, }
	}, {
  	sequelize,
  	tableName: 'authUser',
  	timestamps: true,
});

export const initUserModel = () => AuthUser.sync();
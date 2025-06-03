//backend/user-service/src/models/friendship.models.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../plugins/sequelize';
import { User } from './user.models';

export class Friendship extends Model {
    public id!: number;
    public userId!: number;
    public friendId!: number;
    public status!: 'pending' | 'accepted' | 'declined' | 'blocked';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initFriendshipModel = () => {
	Friendship.init({
    	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
		userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' }, },
    	friendId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' }, },
    	status: { type: DataTypes.ENUM('pending', 'accepted', 'declined', 'blocked'),
			defaultValue: 'pending', allowNull: false, },
	}, {
    	sequelize,
    	tableName: 'friendships',
    	timestamps: true,
    	indexes: [ { unique: true, fields: ['userId', 'friendId'], }, { unique: true, fields: ['friendId', 'userId'], }]
	});
};

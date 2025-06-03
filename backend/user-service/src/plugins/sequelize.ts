//backend/user-service/src/plugins/sequelize.ts
import { Sequelize } from 'sequelize';
import { initUserModel } from '../models/user.models';
import { initFriendshipModel } from '../models/friendship.models';
import { initMatchModel } from '../models/match.models';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/user.sqlite',
    logging: false,
});

export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        initUserModel();
        initFriendshipModel();
        initMatchModel();
        await sequelize.sync();
        console.log('Connected to User database');
    } catch (err) {
        console.error('Failed to connect:', err);
        process.exit(1);
    }
};

export default sequelize;
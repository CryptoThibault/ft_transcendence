//backend/user-service/src/models/match.models.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../plugins/sequelize';
import { User } from './user.models';

export class Match extends Model {
    public id!: number;
    public player1Id!: number;
    public player2Id!: number;
    public winnerId!: number;
    public player1Score!: number;
    public player2Score!: number;
    public playedAt!: Date;
    public readonly createdAt!: Date; 
    public readonly updatedAt!: Date;
}

export const initMatchModel = () => {
    Match.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        player1Id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id', }, onDelete: 'RESTRICT', },
        player2Id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id', }, onDelete: 'RESTRICT', },
        winnerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id', }, onDelete: 'RESTRICT', },
        player1Score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, },
        player2Score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, },
        playedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false, },
    }, {
        sequelize,
        tableName: 'matches',
        timestamps: true,
    });
    // Associations
    // A User can be player1 in many matches
    User.hasMany(Match, { foreignKey: 'player1Id', as: 'matchesAsPlayer1' });
    Match.belongsTo(User, { foreignKey: 'player1Id', as: 'player1' });
    // A User can be player2 in many matches
    User.hasMany(Match, { foreignKey: 'player2Id', as: 'matchesAsPlayer2' });
    Match.belongsTo(User, { foreignKey: 'player2Id', as: 'player2' });
    // A User can win many matches
    User.hasMany(Match, { foreignKey: 'winnerId', as: 'wonMatches' });
    Match.belongsTo(User, { foreignKey: 'winnerId', as: 'winner' });    
};


// Optional: Add a 'loser' association for convenience
    // This assumes it'll have a loser determined from player1Id, player2Id, and winnerId
    // Might add a 'loserId' column to the Match table if you prefer it explicit.
    // just can derive the loser by checking which player is not the winner.

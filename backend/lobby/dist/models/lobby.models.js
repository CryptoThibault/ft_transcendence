"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_init_1 = require("../sequelize_init");
class Lobby extends sequelize_1.Model {
}
Lobby.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    capacity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    creator_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
}, {
    sequelize: sequelize_init_1.sequelize,
    modelName: 'Lobby',
    tableName: 'lobbies',
    timestamps: false,
});
exports.default = Lobby;

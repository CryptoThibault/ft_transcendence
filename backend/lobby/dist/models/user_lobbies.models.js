"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_init_1 = require("../sequelize_init");
class UserLobby extends sequelize_1.Model {
}
UserLobby.init({
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    //TO-DO: add reference
    lobby_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: sequelize_init_1.sequelize,
    tableName: 'user_lobbies',
    timestamps: false,
});
exports.default = UserLobby;

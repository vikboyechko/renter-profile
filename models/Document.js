const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Documents extends Model {}

Documents.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: Datatypes.STRING(50),
            allowNull: true,
        },
        link: {
            type: Datatypes.STRING(256),
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'documents',
    }
);

module.exports = Documents;

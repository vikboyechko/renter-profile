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
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isIn: [['profile_pic', 'property_image']],
            },
        },
        link: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        property_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // property images are optional
            references: {
                model: 'properties',
                key: 'id',
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false, // user id is not optional
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

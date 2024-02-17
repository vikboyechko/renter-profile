const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create Property model and datatypes, including the user_id foreign key.
class Property extends Model {}

Property.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 2]
            },
        },
        zip: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'property',
    }
);

module.exports = Property;

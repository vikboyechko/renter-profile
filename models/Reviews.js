const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create Review model and datatypes, including the user_id and property_id foreign keys.
class Reviews extends Model {}

Reviews.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 10,
            },
        },
        isPublished: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        },
        reviewer_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        reviewee_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        property_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'properties',
                key: 'id',
            },
        },
        reviewee_type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['property', 'user']],
            },
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'reviews',
    }
);

module.exports = Reviews;

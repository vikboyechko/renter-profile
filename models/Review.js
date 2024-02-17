const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create Review model and datatypes, including the user_id and property_id foreign keys.
class Review extends Model {}

Review.init(
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
            allowNull: false,
            validate: {
                min: 1,
                max: 10,
            },
        },
        isPublished: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        reviewer_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        reviewee_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
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
        modelName: 'review',
    }
);

module.exports = Review;

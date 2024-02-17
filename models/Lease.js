const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Lease extends Model {}

Lease.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true, // This allows for currently active leases
        },
        rent_amount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        rent_bedrooms: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['studio', '1br', '2br', '3br']],
            },
        },
        square_footage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        },
        property_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'property',
                key: 'id',
            },
        },
        renter_id: {
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
        modelName: 'lease',
    }
);

module.exports = Lease;
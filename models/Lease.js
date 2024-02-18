const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Lease extends Model { }

Lease.init(
    {
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validate: {
                notNull: {
                    msg: "Start date is Required"
                },
                isDate: {
                    msg: "Please enter starting date"
                }
            },
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validate: {
                notNull: {
                    msg: "End date is Required"
                },
                isDate: {
                    msg: "Please enter ending date"
                }
            },
        },
        rent_bedrooms: {
            type: DataTypes.INTEGER,


        },
        //need to verify vaildate for bedroom
        rent_bedrooms: {
            type: DataTypes.INTEGER,
            validate: {
                studio: {
                    type: DataTypes.Boolean,
                    allowNull: true
                },
                one_bedroom: {
                    type: DataTypes.Boolean,
                    allowNull: true
                },
                two_bedroom: {
                    type: DataTypes.Boolean,
                    allowNull: true
                },
                three_bedroom: {
                    type: DataTypes.Boolean,
                    allowNull: true
                },
            }

        },
        square_footage: {
            type: DataTypes.INTEGER
        },

        propert_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'property',
                key: 'id',
            },
        },
        renter_id: {
            type: DataTypes.INTEGER,
            references: {  //need to verify reference id for renter
                model: 'user',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'project',
    }
);

module.exports = Lease;
  



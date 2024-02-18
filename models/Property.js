const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create Project model and datatypes, including the user_id foreign key.
class Property extends Model {}
//name(optional)
//change to singler--add
Property.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    address_line1: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address_line2: {
      type: DataTypes.STRING(100),
      allowNull:true,
    
    },
    city: {
      type: DataTypes.STRING(25),
      allowNull: false,
      validate: {
        isAlpha: true, 
      },
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
      validate: {
        isAlpha: true, 
      },
    },
    zip: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
      validate: {
        isNumeric: true, 
      },
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'property',
  }
);

module.exports = Property;

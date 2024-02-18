const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Document extends Model {}

Document.init(
  {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    type: {
        type: Datatypes.STRING(50),
        //allowNull: true,
    },
    link:{
        type: Datatypes.STRING(256),
        //allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
      },
    // date_created: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    //   defaultValue: DataTypes.NOW,
    // },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'document',
  }
);

module.exports = Document;
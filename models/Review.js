const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Review extends Model {}

Review.init(
  {
    content: {
      type: DataTypes.STRING(500),
    },
    rating: {
        type:DataTypes.INTEGER(1)
    },
    isPublished:{
        type:DataTypes.Boolean,
    },
    reviewer_id: {
        type: Datatypes.INTEGER,
        allowNull: false,
    },
    reviewee_id: {
        type: Datatypes.INTEGER,
        allowNull: false,
    },
    reviewee_type: {
        type: Datatypes.INTEGER,
        allowNull: false,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'review',
  }
);

module.exports = Review;
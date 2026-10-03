const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { BaseModel } = require('./baseModel');

class Review extends BaseModel {}

Review.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user: { type: DataTypes.INTEGER, allowNull: false, field: 'userId' },
    vehicle: { type: DataTypes.INTEGER, allowNull: false, field: 'vehicleId' },
    rating: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'Reviews',
    timestamps: true,
    indexes: [{ unique: true, fields: ['userId', 'vehicleId'] }],
  }
);

module.exports = Review;

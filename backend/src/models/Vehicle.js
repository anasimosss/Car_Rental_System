const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { BaseModel, jsonField } = require('./baseModel');

class Vehicle extends BaseModel {}

Vehicle.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    make: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    year: DataTypes.INTEGER,
    color: DataTypes.STRING,
    vin: DataTypes.STRING,
    licensePlate: DataTypes.STRING,
    category: DataTypes.STRING,
    specifications: jsonField(DataTypes, 'specifications'),
    pricing: jsonField(DataTypes, 'pricing', false),
    status: { type: DataTypes.STRING, defaultValue: 'Available' },
    images: { ...jsonField(DataTypes, 'images'), defaultValue: '[]' },
    locationId: DataTypes.INTEGER,
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    numReviews: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, modelName: 'Vehicle', tableName: 'Vehicles', timestamps: true }
);

module.exports = Vehicle;
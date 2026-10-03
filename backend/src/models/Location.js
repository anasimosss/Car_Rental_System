const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { BaseModel, jsonField } = require('./baseModel');

class Location extends BaseModel {}

Location.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    country: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    operatingHours: DataTypes.STRING,
    hours: DataTypes.STRING,
    coordinates: jsonField(DataTypes, 'coordinates'),
  },
  { sequelize, modelName: 'Location', tableName: 'Locations', timestamps: true }
);

module.exports = Location;
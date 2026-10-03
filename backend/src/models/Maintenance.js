const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { BaseModel, jsonField } = require('./baseModel');

class Maintenance extends BaseModel {}

Maintenance.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vehicleId: { type: DataTypes.INTEGER, allowNull: false },
    description: DataTypes.TEXT,
    scheduledDate: DataTypes.DATE,
    completedDate: DataTypes.DATE,
    cost: DataTypes.FLOAT,
    status: { type: DataTypes.STRING, defaultValue: 'Scheduled' },
    damagePhotos: { ...jsonField(DataTypes, 'damagePhotos'), defaultValue: '[]' },
  },
  {
    sequelize,
    modelName: 'Maintenance',
    tableName: 'MaintenanceRecords',
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = Maintenance;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { BaseModel, jsonField } = require('./baseModel');

class Booking extends BaseModel {}

Booking.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    vehicleId: { type: DataTypes.INTEGER, allowNull: false },
    pickupLocationId: { type: DataTypes.INTEGER, allowNull: false },
    dropoffLocationId: { type: DataTypes.INTEGER, allowNull: false },
    pickupDate: { type: DataTypes.DATE, allowNull: false },
    returnDate: { type: DataTypes.DATE, allowNull: false },
    totalDays: DataTypes.INTEGER,
    totalPrice: DataTypes.FLOAT,
    customerInfo: jsonField(DataTypes, 'customerInfo', false),
    verificationStatus: { type: DataTypes.STRING, defaultValue: 'Pending' },
    verifiedBy: DataTypes.INTEGER,
    verificationDate: DataTypes.DATE,
    verificationNotes: DataTypes.TEXT,
    paymentMethod: { type: DataTypes.STRING, defaultValue: 'Stripe' },
    paymentStatus: { type: DataTypes.STRING, defaultValue: 'Pending' },
    paymentReference: DataTypes.STRING,
    paymentDate: DataTypes.DATE,
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    paymentId: DataTypes.INTEGER,
    paymentSessionId: DataTypes.STRING,
  },
  { sequelize, modelName: 'Booking', tableName: 'Bookings', timestamps: true }
);

module.exports = Booking;

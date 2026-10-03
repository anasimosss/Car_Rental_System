const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { BaseModel } = require('./baseModel');

class Payment extends BaseModel {}

Payment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    paymentMethod: DataTypes.STRING,
    paymentGateway: { type: DataTypes.STRING, defaultValue: 'Stripe' },
    transactionId: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    invoiceUrl: DataTypes.STRING,
  },
  { sequelize, modelName: 'Payment', tableName: 'Payments', timestamps: true }
);

module.exports = Payment;
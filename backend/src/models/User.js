const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { BaseModel, jsonField } = require('./baseModel');
const roles = require('../constants/roles');

class User extends BaseModel {
  async comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) { this.setDataValue('email', value?.trim().toLowerCase()); },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: roles.CUSTOMER,
      validate: { isIn: [Object.values(roles)] },
    },
    driverLicense: jsonField(DataTypes, 'driverLicense'),
    emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    emailVerifiedAt: DataTypes.DATE,
    resetToken: DataTypes.STRING,
    resetTokenExpiry: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

module.exports = User;
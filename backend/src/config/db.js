const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'car_rental',
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    dialect: 'mssql',
    logging: false,
    dialectOptions: {
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
        ...(process.env.DB_INSTANCE && { instanceName: process.env.DB_INSTANCE }),
      },
    },
  }
);

const connectDB = async () => {
  try {
    if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
      throw new Error('Set DB_USER and DB_PASSWORD in backend/.env');
    }

    await sequelize.authenticate();
    require('../models');
    await sequelize.sync();
    console.log('SQL Server connected');
  } catch (error) {
    console.error('SQL Server connection error:', error.message);
    throw error;
  }
};

connectDB.sequelize = sequelize;

module.exports = connectDB;
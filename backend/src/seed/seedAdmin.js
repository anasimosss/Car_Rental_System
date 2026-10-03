require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  try {
    await connectDB();
    const adminExists = await User.findOne({ where: { role: 'Admin' } });
    if (!adminExists) {
      await User.create({
        name: 'Default Admin',
        email: process.env.ADMIN_EMAIL || 'admin@carrental.com',
        password: process.env.ADMIN_PASSWORD || 'admin1234',
        role: 'Admin',
        emailVerified: true,
      });
      console.log('Default admin seeded');
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Admin seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await connectDB.sequelize.close();
  }
})();
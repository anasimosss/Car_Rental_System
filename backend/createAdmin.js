require('dotenv').config();
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const createAdmin = async () => {
  try {
    await connectDB();
    // Check if admin already exists
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const existingAdmin = await User.findOne({ where: { email } });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    await User.create({
      name: 'Admin',
      email,
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'Admin',
      emailVerified: true
    });

    console.log(' Admin user created successfully');
    console.log(`Email: ${email}`);
  } catch (error) {
    console.error(' Error creating admin user:', error.message);
    process.exitCode = 1;
  } finally {
    await connectDB.sequelize.close();
  }
};

createAdmin().catch(console.error);
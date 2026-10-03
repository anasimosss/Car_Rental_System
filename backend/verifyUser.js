require("dotenv").config();
const connectDB = require("./src/config/db");
const User = require("./src/models/User");

const verifyUserEmail = async (email) => {
  try {
    await connectDB();

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (user) {
      user.emailVerified = true;
      user.emailVerifiedAt = new Date();
      await user.save();
    }

    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
    } else {
      console.log(
        `✅ Email verified successfully for: ${user.name} (${user.email})`
      );
      console.log(`   Role: ${user.role}`);
      console.log(`   Verified: ${user.emailVerified}`);
    }

  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    await connectDB.sequelize.close();
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log("Usage: node verifyUser.js <email>");
  console.log("Example: node verifyUser.js betitesema19@gmail.com");
  process.exit(1);
}

verifyUserEmail(email);

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { secret, expires } = require("../config/jwt");
const sgMail = require("../config/sendgrid");
const crypto = require("crypto");
const { Op } = require("sequelize");

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: expires });

exports.register = async (req, res) => {
  try {
    console.log("Register request headers:", req.headers);
    console.log("Register request body:", JSON.stringify(req.body, null, 2));

    // Ensure body is properly parsed
    if (!req.body) {
      console.error("No request body received");
      return res.status(400).json({
        success: false,
        message: "No request body received",
        errors: [{ field: "general", message: "No data provided" }],
      });
    }

    const { name, email, password, phone } = req.body;

    // Log the parsed values
    console.log("Parsed values:", {
      name,
      email,
      phone,
      password: password ? "[REDACTED]" : "undefined",
    });

    // Validate required fields with detailed error messages
    const errors = [];

    if (!name || name.trim().length < 2) {
      errors.push({
        field: "name",
        message: "Name must be at least 2 characters long",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push({
        field: "email",
        message: "Please enter a valid email address",
      });
    } else {
      // Only check for existing user if email is valid
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        errors.push({
          field: "email",
          message: "Email is already registered",
        });
      }
    }

    if (!password || password.length < 6) {
      errors.push({
        field: "password",
        message: "Password must be at least 6 characters long",
      });
    }

    if (phone && !/^\+?[0-9\s-]{10,}$/.test(phone)) {
      errors.push({
        field: "phone",
        message: "Please enter a valid phone number",
      });
    }

    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    // Create user (initially not verified)
    const user = new User({
      name,
      email,
      password,
      phone,
      role: "Customer",
      emailVerified: false,
    });

    await user.save();

    // Create verification token
    const verificationToken = createToken(user);
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // Send verification email

    // Try to send email (optional)
    try {
      await sgMail.send({
        to: email,
        from: process.env.SENDER_EMAIL || "noreply@carrental.com",
        subject: "Verify your email",
        text: `Click to verify: ${verificationLink}`,
      });
    } catch (emailError) {
      console.error(
        "Email sending failed (but continuing):",
        emailError.message
      );
      // Continue even if email fails
    }

    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
      verificationLink:
        process.env.NODE_ENV === "development" ? verificationLink : undefined,
    });
  } catch (err) {
    console.error("Registration error:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    // Handle duplicate key errors (e.g., duplicate email)
    if (err.code === 11000 || err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Email already in use",
        field: "email",
      });
    }

    res.status(500).json({
      message: "Registration failed. Please try again later.",
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    // Get token from query params (for email links) or request body (for API calls)
    const token = req.query.token || req.body.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, secret);

    // Find the user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified",
      });
    }

    // Update user's verification status
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();

    // Return success response
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);

    let errorMessage = "Email verification failed";
    let statusCode = 400;

    if (error.name === "TokenExpiredError") {
      errorMessage = "Verification link has expired";
      statusCode = 401;
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Invalid verification token";
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });
    if (!user.emailVerified)
      return res.status(401).json({ message: "Email not verified" });

    const token = createToken(user);
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    res.status(401).json({ message: "Login failed" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "No user found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600 * 1000; // 1 hour
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sgMail.send({
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: "Password reset",
      text: `Reset link: ${resetLink}`,
    });

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: new Date() },
      },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = password;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(400).json({ message: "Failed to reset password" });
  }
};

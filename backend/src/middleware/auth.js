const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const User = require("../models/User");
const roles = require("../constants/roles");

const isAdminRole = (role) => role === roles.ADMIN || role === "admin";

const protect = async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const admin = (req, res, next) => {
  console.log("Admin check - User role:", req.user?.role);

  if (req.user && isAdminRole(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

const bookingStaff = (req, res, next) => {
  if (
    req.user &&
    (isAdminRole(req.user.role) ||
      req.user.role === roles.BOOKING_RESERVATION_STAFF)
  ) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized to manage bookings" });
  }
};

const fleetManager = (req, res, next) => {
  if (
    req.user &&
    (isAdminRole(req.user.role) || req.user.role === roles.FLEET_MANAGER)
  ) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized to manage fleet operations" });
  }
};

const paymentStaff = (req, res, next) => {
  if (
    req.user &&
    (isAdminRole(req.user.role) || req.user.role === roles.PAYMENT_FINANCE_STAFF)
  ) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized to manage payments" });
  }
};

const bookingReader = (req, res, next) => {
  if (
    req.user &&
    (isAdminRole(req.user.role) ||
      req.user.role === roles.BOOKING_RESERVATION_STAFF ||
      req.user.role === roles.PAYMENT_FINANCE_STAFF ||
      req.user.role === roles.MANAGER)
  ) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized to view all bookings" });
  }
};

const fleetReader = (req, res, next) => {
  if (
    req.user &&
    (isAdminRole(req.user.role) ||
      req.user.role === roles.FLEET_MANAGER ||
      req.user.role === roles.MANAGER)
  ) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized to view fleet operations" });
  }
};

const managerReadOnly = (req, res, next) => {
  if (req.user?.role === roles.MANAGER) {
    return res.status(403).json({ message: "Manager access is read-only" });
  }
  next();
};

module.exports = {
  protect,
  admin,
  bookingStaff,
  fleetManager,
  paymentStaff,
  bookingReader,
  fleetReader,
  managerReadOnly,
};

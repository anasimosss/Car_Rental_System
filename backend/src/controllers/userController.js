const User = require("../models/User");
const roles = require("../constants/roles");

// Get own profile
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user profile", error });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users", error });
  }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user", error });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    if (
      req.body.role !== undefined &&
      !Object.values(roles).includes(req.body.role)
    ) {
      return res.status(400).json({
        message: "Invalid role",
        allowedRoles: Object.values(roles),
      });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.update(req.body);
    user.password = undefined;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
};

module.exports = {
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
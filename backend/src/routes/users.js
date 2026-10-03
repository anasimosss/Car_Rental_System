const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Get own profile
router.get('/me', protect, getMe);

// Get all users (admin only)
router.get('/', protect, admin, getAllUsers);

// Get user by ID (admin only)
router.get('/:id', protect, admin, getUserById);

// Update user (admin only)
router.put('/:id', protect, admin, updateUser);

// Delete user (admin only)
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');

// Admin dashboard stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    // Add your admin stats logic here
    res.json({
      users: 0,
      vehicles: 0,
      bookings: 0,
      revenue: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

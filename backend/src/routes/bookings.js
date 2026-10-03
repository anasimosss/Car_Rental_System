const express = require("express");
const router = express.Router();
const { protect, bookingStaff, bookingReader, managerReadOnly } = require("../middleware/auth");
const {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  verifyBooking,
  getPendingBookings,
} = require("../controllers/bookingController");

// Create a new booking (protected route)
router.post("/", protect, managerReadOnly, createBooking);

// Get all bookings for reservation and payment review
router.get("/", protect, bookingReader, getAllBookings);

// Read pending bookings for Admin, reservation/payment staff, and Manager.
router.get("/pending", protect, bookingReader, getPendingBookings);

// Get current user's bookings
router.get("/my", protect, getMyBookings);

// Verify/Approve booking (admin and booking staff)
router.patch("/:id/verify", protect, bookingStaff, verifyBooking);

// Get single booking by ID
router.get("/:id", protect, getBookingById);

module.exports = router;

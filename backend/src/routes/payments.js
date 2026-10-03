const express = require("express");
const router = express.Router();
const { protect, paymentStaff, managerReadOnly } = require("../middleware/auth");
const {
  createStripeSession,
  createEthiopianPayment,
  confirmEthiopianPayment,
} = require("../controllers/paymentController");

// Create Stripe session (protected route)
router.post("/stripe-session", protect, managerReadOnly, createStripeSession);

// Create Ethiopian payment (Telebirr, CBE Birr, E-Birr)
router.post("/ethiopian-payment", protect, managerReadOnly, createEthiopianPayment);

// Confirm Ethiopian payment (admin and payment/finance staff)
router.post("/confirm-payment", protect, paymentStaff, confirmEthiopianPayment);

module.exports = router;

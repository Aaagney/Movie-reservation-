const express = require("express");
const router = express.Router();

const {
  createPayment,
  getAllPayments,
  getPaymentByBookingId,
} = require("../controllers/paymentController");

// Create payment
router.post("/", createPayment);

// Get all successful payments
router.get("/", getAllPayments);

// Get payment by booking ID
router.get(
  "/booking/:bookingId",
  getPaymentByBookingId
);

module.exports = router;
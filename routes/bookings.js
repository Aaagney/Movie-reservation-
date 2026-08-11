// routes/bookings.js
const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingsByUser,
  cancelBooking,
} = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/:userId', getBookingsByUser);
router.delete('/:bookingId', cancelBooking);

module.exports = router;

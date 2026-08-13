const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/showtimes/:showtimeId/seats', bookingController.getShowtimeSeats);
router.post('/confirm', bookingController.createBooking);
router.get('/user/:username', bookingController.getUserBookings);
router.put('/cancel/:bookingId', bookingController.cancelBooking);

module.exports = router;
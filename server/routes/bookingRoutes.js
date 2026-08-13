const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

<<<<<<< HEAD
router.post('/', bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);

module.exports = router;
=======
router.get('/showtimes/:showtimeId/seats', bookingController.getShowtimeSeats);
router.post('/confirm', bookingController.createBooking);
router.get('/user/:username', bookingController.getUserBookings);
router.put('/cancel/:bookingId', bookingController.cancelBooking);

module.exports = router;
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481

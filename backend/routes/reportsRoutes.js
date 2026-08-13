const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

// Define reports endpoints
router.get('/stats', reportsController.getStats);
router.get('/sales', reportsController.getSalesTrend);
router.get('/movie-wise', reportsController.getMovieWiseReport);
router.get('/theatre-wise', reportsController.getTheatreWiseReport);
router.get('/bookings-list', reportsController.getBookingsList);

module.exports = router;

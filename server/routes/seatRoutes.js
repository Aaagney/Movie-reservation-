const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

router.get('/showtime/:showtimeId', seatController.getSeatMapForShowtime);

module.exports = router;

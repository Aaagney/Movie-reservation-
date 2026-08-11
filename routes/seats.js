
const express = require('express');
const router = express.Router();
const { getSeatsByShow, bookSeats } = require('../controllers/seatController');

router.get('/:showId', getSeatsByShow);
router.put('/book', bookSeats);

module.exports = router;

const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');
const { requireAdmin } = require('../middleware/auth');

router.get('/movie/:movieId', showtimeController.getShowtimesByMovie);
router.get('/', showtimeController.getAllShowtimes);
router.get('/:id', showtimeController.getShowtimeById);
router.post('/', requireAdmin, showtimeController.createShowtime);
router.put('/:id', requireAdmin, showtimeController.updateShowtime);
router.delete('/:id', requireAdmin, showtimeController.deleteShowtime);

module.exports = router;

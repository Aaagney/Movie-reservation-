// routes/shows.js
const express = require('express');
const router = express.Router();
const { getShowsByMovie } = require('../controllers/showController');

router.get('/:movieId', getShowsByMovie);

module.exports = router;

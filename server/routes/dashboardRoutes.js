const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireAdmin } = require('../middleware/auth');

router.get('/stats', requireAdmin, dashboardController.getStats);

module.exports = router;

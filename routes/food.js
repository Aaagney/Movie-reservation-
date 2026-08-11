// routes/food.js
const express = require('express');
const router = express.Router();
const { getFoodItems, createFoodOrder } = require('../controllers/foodController');

router.get('/', getFoodItems);
router.post('/orders', createFoodOrder);

module.exports = router;

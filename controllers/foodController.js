// controllers/foodController.js
const { query } = require('../database/db');

// GET /api/food
// Returns all food & beverage items, optionally filtered by ?category=popcorn|drinks|combo
async function getFoodItems(req, res) {
  try {
    const { category } = req.query;
    let result;

    if (category) {
      result = await query(
        `SELECT * FROM food_items WHERE category = $1 ORDER BY price ASC`,
        [category]
      );
    } else {
      result = await query(`SELECT * FROM food_items ORDER BY category ASC, price ASC`);
    }

    res.json({ success: true, foodItems: result.rows });
  } catch (err) {
    console.error('getFoodItems error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch food items' });
  }
}

// POST /api/orders
// body: { bookingId, items: [{ foodItemId, quantity }] }
// Used when food is added to an existing confirmed booking (e.g. from the
// booking history page) rather than at initial checkout.
async function createFoodOrder(req, res) {
  const { bookingId, items } = req.body;

  if (!bookingId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'bookingId and a non-empty items array are required',
    });
  }

  try {
    const createdLines = [];

    for (const item of items) {
      const { foodItemId, quantity } = item;
      if (!foodItemId || !quantity) continue;

      const priceResult = await query(`SELECT price FROM food_items WHERE id = $1`, [foodItemId]);
      if (priceResult.rows.length === 0) continue;

      const lineTotal = Number(priceResult.rows[0].price) * Number(quantity);
      const insertResult = await query(
        `INSERT INTO food_orders (booking_id, food_item_id, quantity, total_price)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [bookingId, foodItemId, quantity, lineTotal]
      );
      createdLines.push(insertResult.rows[0]);
    }

    // Keep the booking's total_amount in sync with the new food lines.
    const sumResult = await query(
      `SELECT COALESCE(SUM(total_price), 0) AS food_total FROM food_orders WHERE booking_id = $1`,
      [bookingId]
    );
    await query(
      `UPDATE bookings
       SET total_amount = (SELECT price FROM shows WHERE id = (SELECT show_id FROM bookings WHERE id = $1))
                           + $2
       WHERE id = $1`,
      [bookingId, sumResult.rows[0].food_total]
    );

    res.status(201).json({ success: true, order: createdLines });
  } catch (err) {
    console.error('createFoodOrder error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to create food order' });
  }
}

module.exports = { getFoodItems, createFoodOrder };

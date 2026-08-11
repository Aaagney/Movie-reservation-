// controllers/seatController.js
const { pool, query } = require('../database/db');

// GET /api/seats/:showId
// Returns the full seat map for a show, ordered so the frontend can lay it
// out row by row (A1..A8, B1..B8, ...).
async function getSeatsByShow(req, res) {
  try {
    const { showId } = req.params;

    const result = await query(
      `SELECT id, seat_number, status
       FROM seats
       WHERE show_id = $1
       ORDER BY LEFT(seat_number, 1) ASC,
                CAST(SUBSTRING(seat_number FROM '[0-9]+') AS INTEGER) ASC`,
      [showId]
    );

    res.json({ success: true, seats: result.rows });
  } catch (err) {
    console.error('getSeatsByShow error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch seats' });
  }
}

// PUT /api/seats/book
// body: { seatIds: [1,2,3] }
// Marks seats as booked. Wrapped in a transaction with a row lock so two
// people selecting the same seat at the same instant can't both succeed.
async function bookSeats(req, res) {
  const { seatIds } = req.body;

  if (!Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ success: false, message: 'seatIds must be a non-empty array' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock the target rows first so a concurrent request can't book the
    // same seats between our availability check and our update.
    const lockResult = await client.query(
      `SELECT id, status FROM seats WHERE id = ANY($1::int[]) FOR UPDATE`,
      [seatIds]
    );

    const alreadyBooked = lockResult.rows.filter((row) => row.status === 'booked');
    if (alreadyBooked.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: 'One or more selected seats were just booked by someone else',
        seatIds: alreadyBooked.map((row) => row.id),
      });
    }

    await client.query(
      `UPDATE seats SET status = 'booked' WHERE id = ANY($1::int[])`,
      [seatIds]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Seats booked', seatIds });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('bookSeats error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to book seats' });
  } finally {
    client.release();
  }
}

module.exports = { getSeatsByShow, bookSeats };

// controllers/bookingController.js
const { pool, query } = require('../database/db');

// POST /api/bookings
// body: { userId, showId, seatIds: [1,2], foodItems: [{ foodItemId, quantity }], totalAmount }
// Creates the booking, links the chosen seats, marks those seats booked,
// and records any food order lines — all inside a single transaction so a
// booking is never left half-created.
async function createBooking(req, res) {
  const { userId, showId, seatIds, foodItems = [], totalAmount } = req.body;

  if (!userId || !showId || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'userId, showId and a non-empty seatIds array are required',
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock and verify the seats are still available.
    const seatCheck = await client.query(
      `SELECT id, status FROM seats WHERE id = ANY($1::int[]) FOR UPDATE`,
      [seatIds]
    );

    if (seatCheck.rows.length !== seatIds.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Some seats do not exist' });
    }

    const takenSeats = seatCheck.rows.filter((row) => row.status === 'booked');
    if (takenSeats.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: 'One or more seats are no longer available',
        seatIds: takenSeats.map((row) => row.id),
      });
    }

    // Create the booking row.
    const bookingResult = await client.query(
      `INSERT INTO bookings (user_id, show_id, total_amount, status)
       VALUES ($1, $2, $3, 'confirmed') RETURNING *`,
      [userId, showId, totalAmount || 0]
    );
    const booking = bookingResult.rows[0];

    // Link seats to the booking and flip them to booked.
    for (const seatId of seatIds) {
      await client.query(
        `INSERT INTO booking_seats (booking_id, seat_id) VALUES ($1, $2)`,
        [booking.id, seatId]
      );
    }
    await client.query(
      `UPDATE seats SET status = 'booked' WHERE id = ANY($1::int[])`,
      [seatIds]
    );

    // Record food order lines, if any were supplied.
    for (const item of foodItems) {
      const { foodItemId, quantity } = item;
      if (!foodItemId || !quantity) continue;

      const priceResult = await client.query(
        `SELECT price FROM food_items WHERE id = $1`,
        [foodItemId]
      );
      if (priceResult.rows.length === 0) continue;

      const lineTotal = Number(priceResult.rows[0].price) * Number(quantity);
      await client.query(
        `INSERT INTO food_orders (booking_id, food_item_id, quantity, total_price)
         VALUES ($1, $2, $3, $4)`,
        [booking.id, foodItemId, quantity, lineTotal]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, booking });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('createBooking error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  } finally {
    client.release();
  }
}

// GET /api/bookings/:userId
// Returns booking history for a user with movie, theatre, seat and food
// details flattened onto each booking so the frontend needs one call.
async function getBookingsByUser(req, res) {
  try {
    const { userId } = req.params;

    const bookingsResult = await query(
      `SELECT b.id, b.booking_date, b.total_amount, b.status,
              s.show_time, s.show_date, s.price,
              m.title AS movie_title, m.poster_url, m.duration,
              t.name AS theatre_name, t.location
       FROM bookings b
       JOIN shows s ON s.id = b.show_id
       JOIN movies m ON m.id = s.movie_id
       JOIN theatres t ON t.id = s.theatre_id
       WHERE b.user_id = $1
       ORDER BY b.booking_date DESC`,
      [userId]
    );

    const bookings = bookingsResult.rows;

    // Attach seat numbers and food items for each booking.
    for (const booking of bookings) {
      const seatsResult = await query(
        `SELECT se.seat_number
         FROM booking_seats bs
         JOIN seats se ON se.id = bs.seat_id
         WHERE bs.booking_id = $1
         ORDER BY se.seat_number ASC`,
        [booking.id]
      );
      booking.seats = seatsResult.rows.map((row) => row.seat_number);

      const foodResult = await query(
        `SELECT fi.name, fo.quantity, fo.total_price
         FROM food_orders fo
         JOIN food_items fi ON fi.id = fo.food_item_id
         WHERE fo.booking_id = $1`,
        [booking.id]
      );
      booking.food = foodResult.rows;
    }

    res.json({ success: true, bookings });
  } catch (err) {
    console.error('getBookingsByUser error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch booking history' });
  }
}

// DELETE /api/bookings/:bookingId
// Cancels a booking and frees up its seats again.
async function cancelBooking(req, res) {
  const { bookingId } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const bookingResult = await client.query(
      `SELECT * FROM bookings WHERE id = $1 FOR UPDATE`,
      [bookingId]
    );
    if (bookingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (bookingResult.rows[0].status === 'cancelled') {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    await client.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = $1`,
      [bookingId]
    );

    // Free up the seats linked to this booking.
    await client.query(
      `UPDATE seats SET status = 'available'
       WHERE id IN (SELECT seat_id FROM booking_seats WHERE booking_id = $1)`,
      [bookingId]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('cancelBooking error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to cancel booking' });
  } finally {
    client.release();
  }
}

module.exports = { createBooking, getBookingsByUser, cancelBooking };

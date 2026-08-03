const db = require('../config/db');

// GET /api/seats/showtime/:showtimeId  -> full seat map with availability
exports.getSeatMapForShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;

    const [showtimeRows] = await db.query(
      `SELECT sh.*, sc.rows_count, sc.columns_count, sc.id AS screen_id
       FROM showtimes sh JOIN screens sc ON sh.screen_id = sc.id WHERE sh.id = ?`,
      [showtimeId]
    );
    if (showtimeRows.length === 0) return res.status(404).json({ success: false, message: 'Showtime not found' });
    const showtime = showtimeRows[0];

    const [seats] = await db.query('SELECT * FROM seats WHERE screen_id = ? ORDER BY seat_row, seat_number', [showtime.screen_id]);

    const [bookedRows] = await db.query(
      `SELECT bs.seat_id FROM booking_seats bs
       JOIN bookings b ON bs.booking_id = b.id
       WHERE b.showtime_id = ? AND b.booking_status = 'confirmed'`,
      [showtimeId]
    );
    const bookedSet = new Set(bookedRows.map((r) => r.seat_id));

    const seatMap = seats.map((s) => ({
      ...s,
      status: bookedSet.has(s.id) ? 'booked' : s.seat_type === 'vip' ? 'vip' : 'available',
    }));

    res.json({
      success: true,
      data: {
        showtime,
        seats: seatMap,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch seat map' });
  }
};

const db = require('../config/db');

// POST /api/bookings  { user_id, showtime_id, seat_ids: [] }
exports.createBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { user_id, showtime_id, seat_ids } = req.body;
    if (!user_id || !showtime_id || !Array.isArray(seat_ids) || seat_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'user_id, showtime_id and seat_ids are required' });
    }

    await connection.beginTransaction();

    const [showtimeRows] = await connection.query('SELECT * FROM showtimes WHERE id = ? FOR UPDATE', [showtime_id]);
    if (showtimeRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }
    const showtime = showtimeRows[0];

    // Check seats aren't already booked
    const [alreadyBooked] = await connection.query(
      `SELECT bs.seat_id FROM booking_seats bs
       JOIN bookings b ON bs.booking_id = b.id
       WHERE b.showtime_id = ? AND b.booking_status = 'confirmed' AND bs.seat_id IN (?)`,
      [showtime_id, seat_ids]
    );
    if (alreadyBooked.length > 0) {
      await connection.rollback();
      return res.status(409).json({ success: false, message: 'One or more selected seats are already booked' });
    }

    const [seatRows] = await connection.query('SELECT * FROM seats WHERE id IN (?)', [seat_ids]);
    const pricePerStandard = parseFloat(showtime.ticket_price);
    const pricePerVip = pricePerStandard + 5;
    const total = seatRows.reduce((sum, s) => sum + (s.seat_type === 'vip' ? pricePerVip : pricePerStandard), 0);

    const [bookingResult] = await connection.query(
      'INSERT INTO bookings (user_id, showtime_id, total_amount, booking_status) VALUES (?, ?, ?, "confirmed")',
      [user_id, showtime_id, total.toFixed(2)]
    );
    const bookingId = bookingResult.insertId;

    const bookingSeatValues = seatRows.map((s) => [bookingId, s.id, s.seat_type === 'vip' ? pricePerVip : pricePerStandard]);
    await connection.query('INSERT INTO booking_seats (booking_id, seat_id, price) VALUES ?', [bookingSeatValues]);

    await connection.query('UPDATE showtimes SET available_seats = available_seats - ? WHERE id = ?', [seat_ids.length, showtime_id]);

    await connection.commit();

    res.status(201).json({
      success: true,
      data: { booking_id: bookingId, total_amount: total.toFixed(2), seats: seatRows.length },
    });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  } finally {
    connection.release();
  }
};

// GET /api/bookings/:id  (full booking summary)
exports.getBookingById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, u.name as user_name, u.email as user_email,
              m.title as movie_title, m.poster_url,
              t.name as theatre_name, sc.screen_name,
              sh.show_date, sh.start_time, sh.format, sh.language
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN showtimes sh ON b.showtime_id = sh.id
       JOIN movies m ON sh.movie_id = m.id
       JOIN theatres t ON sh.theatre_id = t.id
       JOIN screens sc ON sh.screen_id = sc.id
       WHERE b.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Booking not found' });

    const [seats] = await db.query(
      `SELECT s.seat_row, s.seat_number, s.seat_type, bs.price
       FROM booking_seats bs JOIN seats s ON bs.seat_id = s.id WHERE bs.booking_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...rows[0], seats } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch booking' });
  }
};

// GET /api/bookings?user_id=  (booking history) or all (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const { user_id } = req.query;
    let sql = `
      SELECT b.*, u.name as user_name, m.title as movie_title, m.poster_url,
             t.name as theatre_name, sh.show_date, sh.start_time
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN showtimes sh ON b.showtime_id = sh.id
      JOIN movies m ON sh.movie_id = m.id
      JOIN theatres t ON sh.theatre_id = t.id`;
    const params = [];
    if (user_id) {
      sql += ' WHERE b.user_id = ?';
      params.push(user_id);
    }
    sql += ' ORDER BY b.booked_at DESC';
    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

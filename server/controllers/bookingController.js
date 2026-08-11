const db = require('../config/db');

// Helper to initialize seat map (A1-I10) for a showtime if not yet populated
const initializeSeats = async (showtimeId) => {
  const [existing] = await db.query('SELECT seat_code, status FROM seats WHERE showtime_id = ?', [showtimeId]);
  if (existing.length > 0) return existing;

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const cols = 10;
  const insertValues = [];

  for (let r of rows) {
    for (let c = 1; c <= cols; c++) {
      const code = `${r}${c}`;
      // Randomly assign a few blocked seats for realism
      let status = 'available';
      if ((r === 'A' || r === 'B') && (c === 3 || c === 4)) status = 'blocked';
      insertValues.push([showtimeId, code, status]);
    }
  }

  await db.query('INSERT INTO seats (showtime_id, seat_code, status) VALUES ?', [insertValues]);
  const [freshSeats] = await db.query('SELECT seat_code, status FROM seats WHERE showtime_id = ?', [showtimeId]);
  return freshSeats;
};

exports.getShowtimeSeats = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    const [showtime] = await db.query(
      `SELECT s.*, m.title as movie_title, m.poster_url 
       FROM showtimes s JOIN movies m ON s.movie_id = m.id WHERE s.id = ?`, 
      [showtimeId]
    );
    if (showtime.length === 0) return res.status(404).json({ message: 'Showtime not found' });

    const seats = await initializeSeats(showtimeId);
    res.json({ showtime: showtime[0], seats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { username, showtime_id, seats, total_amount, service_fee } = req.body;

    const [users] = await connection.query('SELECT id FROM users WHERE username = ?', [username]);
    if (users.length === 0) throw new Error('User not found');
    const userId = users[0].id;

    // Generate 8 character booking ref
    const booking_ref = 'CV-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const [bookingResult] = await connection.query(
      'INSERT INTO bookings (booking_ref, user_id, showtime_id, total_amount, service_fee) VALUES (?, ?, ?, ?, ?)',
      [booking_ref, userId, showtime_id, total_amount, service_fee]
    );

    const bookingId = bookingResult.insertId;

    for (let seatCode of seats) {
      await connection.query('INSERT INTO booking_seats (booking_id, seat_code) VALUES (?, ?)', [bookingId, seatCode]);
      await connection.query('UPDATE seats SET status = "reserved" WHERE showtime_id = ? AND seat_code = ?', [showtime_id, seatCode]);
    }

    await connection.commit();
    res.json({ success: true, booking_ref, bookingId });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const { username } = req.params;
    const query = `
      SELECT 
        b.id, b.booking_ref, b.total_amount, b.service_fee, b.status, b.created_at,
        m.title as movie_title, m.poster_url, s.hall_name, s.show_date, s.show_time,
        GROUP_CONCAT(bs.seat_code) as seat_list
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      LEFT JOIN booking_seats bs ON b.id = bs.booking_id
      WHERE u.username = ?
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `;
    const [bookings] = await db.query(query, [username]);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { bookingId } = req.params;

    const [booking] = await connection.query('SELECT showtime_id FROM bookings WHERE id = ?', [bookingId]);
    if (booking.length === 0) throw new Error('Booking not found');

    const [seats] = await connection.query('SELECT seat_code FROM booking_seats WHERE booking_id = ?', [bookingId]);
    const showtimeId = booking[0].showtime_id;

    for (let s of seats) {
      await connection.query('UPDATE seats SET status = "available" WHERE showtime_id = ? AND seat_code = ?', [showtimeId, s.seat_code]);
    }

    await connection.query('UPDATE bookings SET status = "CANCELLED" WHERE id = ?', [bookingId]);

    await connection.commit();
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};
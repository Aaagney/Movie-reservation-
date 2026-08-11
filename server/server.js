const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies 

// MySQL Pool Connection
const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3307, // 3307 as configured in Workbench
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'cinevault_db',
  waitForConnections: true,
  connectionLimit: 10
});

db.getConnection((err, conn) => {
  if (err) {
    console.error('❌ MySQL Pool Connection Error:', err.message);
  } else {
    console.log('✅ CINÉVAULT MySQL Database Connected on Port', process.env.DB_PORT || 3307);
    conn.release();
  }
});

// ======================= MOVIES ROUTES =======================

// 1. Get All Movies (with search and category filtering)
app.get('/api/movies', (req, res) => {
  const { search, category } = req.query;
  let sql = 'SELECT * FROM movies WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (LOWER(title) LIKE ? OR LOWER(director) LIKE ?)';
    params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
  }

  if (category && category !== 'All') {
    sql += ' AND category = ?';
    params.push(category);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. Get Single Movie Details + Showtimes by ID
app.get('/api/movies/:id', (req, res) => {
  const movieId = req.params.id;
  const movieSql = 'SELECT * FROM movies WHERE id = ?';
  const showtimesSql = 'SELECT * FROM showtimes WHERE movie_id = ?';

  db.query(movieSql, [movieId], (err, movieResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (movieResults.length === 0) return res.status(404).json({ error: 'Movie not found' });

    db.query(showtimesSql, [movieId], (err, showtimeResults) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ...movieResults[0], showtimes: showtimeResults });
    });
  });
});

// ======================= BOOKINGS ROUTES =======================

// 3. GET /api/bookings (Fetch bookings via query string, e.g., ?username=youname)
app.get('/api/bookings', (req, res) => {
  const userName = req.query.user_name || req.query.username;

  let sql = 'SELECT * FROM bookings ORDER BY id DESC';
  let params = [];

  if (userName) {
    sql = 'SELECT * FROM bookings WHERE user_name = ? ORDER BY id DESC';
    params = [userName];
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('❌ Error fetching bookings:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 4. GET /api/bookings/reserved (Fetch all confirmed seats for a movie & showtime)
app.get('/api/bookings/reserved', (req, res) => {
  const { movie_title, showtime_label } = req.query;

  let sql = "SELECT seats FROM bookings WHERE status = 'CONFIRMED'";
  const params = [];

  if (movie_title) {
    sql += ' AND movie_title = ?';
    params.push(movie_title);
  }

  if (showtime_label) {
    sql += ' AND showtime_label = ?';
    params.push(showtime_label);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('❌ Error fetching reserved seats:', err.message);
      return res.status(500).json({ error: err.message });
    }

    let bookedSeats = [];
    results.forEach((row) => {
      if (row.seats) {
        const seatArray = String(row.seats).split(',').map((s) => s.trim());
        bookedSeats.push(...seatArray);
      }
    });

    console.log(`🎟️ Reserved seats for "${movie_title}":`, bookedSeats);
    res.json(bookedSeats);
  });
});

// 5. GET /api/bookings/user/:username (Fixes Axios GET /api/bookings/user/youname)
app.get('/api/bookings/user/:username', (req, res) => {
  const userName = req.params.username;
  const sql = 'SELECT * FROM bookings WHERE user_name = ? ORDER BY id DESC';

  db.query(sql, [userName], (err, results) => {
    if (err) {
      console.error('❌ Error fetching user bookings:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`📦 Found ${results.length} bookings for user: ${userName}`);
    res.json(results);
  });
});

// 6. GET /api/bookings/:username (Alternative route pattern)
app.get('/api/bookings/:username', (req, res) => {
  const userName = req.params.username;
  const sql = 'SELECT * FROM bookings WHERE user_name = ? ORDER BY id DESC';

  db.query(sql, [userName], (err, results) => {
    if (err) {
      console.error('❌ Error fetching user bookings:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 7. POST /api/bookings (Create a new Booking)
app.post('/api/bookings', (req, res) => {
  console.log('📥 Booking Request Received:', req.body);

  const {
    booking_code,
    user_name,
    movie_title,
    hall_name,
    showtime_label,
    seats,
    total_amount,
    poster_url
  } = req.body || {};

  const safeBookingCode = booking_code || 'BK' + Math.floor(100000 + Math.random() * 900000);
  const safeUserName = user_name || 'youname';
  const safeMovieTitle = movie_title || 'Untitled Movie';
  const safeHallName = hall_name || 'Grand Hall';
  const safeShowtime = showtime_label || 'Standard Showtime';

  const safeSeats = Array.isArray(seats)
    ? seats.join(', ')
    : (seats ? String(seats) : 'Standard');

  const safeAmount = parseFloat(total_amount) || 0.00;
  const safePoster = poster_url || '';

  const sql = `INSERT INTO bookings 
    (booking_code, user_name, movie_title, hall_name, showtime_label, seats, total_amount, poster_url, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')`;

  const values = [
    safeBookingCode,
    safeUserName,
    safeMovieTitle,
    safeHallName,
    safeShowtime,
    safeSeats,
    safeAmount,
    safePoster
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ MySQL Insert Booking Error:', err.sqlMessage || err.message);
      return res.status(500).json({ error: 'Database insert error: ' + (err.sqlMessage || err.message) });
    }

    console.log(`✅ Booking created successfully! ID: ${result.insertId}, Code: ${safeBookingCode}`);
    res.status(201).json({
      success: true,
      bookingId: result.insertId,
      booking_code: safeBookingCode
    });
  });
});

// 8. POST /api/bookings/cancel/:id (Cancel by ID or Booking Code)
app.post('/api/bookings/cancel/:id', (req, res) => {
  const bookingIdentifier = req.params.id;
  const sql = "UPDATE bookings SET status = 'CANCELLED' WHERE id = ? OR booking_code = ?";

  db.query(sql, [bookingIdentifier, bookingIdentifier], (err, result) => {
    if (err) {
      console.error('❌ MySQL Cancel Booking Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`🚫 Booking ${bookingIdentifier} updated to CANCELLED`);
    res.json({ success: true, message: 'Booking cancelled successfully' });
  });
});

// 9. DELETE /api/bookings/:id
app.delete('/api/bookings/:id', (req, res) => {
  const bookingIdentifier = req.params.id;
  const sql = "UPDATE bookings SET status = 'CANCELLED' WHERE id = ? OR booking_code = ?";

  db.query(sql, [bookingIdentifier, bookingIdentifier], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Booking cancelled successfully' });
  });
});



// ======================= SERVER START =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 CINÉVAULT Express Backend running on http://localhost:${PORT}`));
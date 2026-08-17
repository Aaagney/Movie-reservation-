const db = require('../config/db');

const BASE_SELECT = `
  SELECT sh.*, m.title as movie_title, m.poster_url, m.duration_minutes,
         t.name as theatre_name, t.city,
         sc.screen_name, sc.screen_number
  FROM showtimes sh
  JOIN movies m ON sh.movie_id = m.id
  JOIN theatres t ON sh.theatre_id = t.id
  JOIN screens sc ON sh.screen_id = sc.id
`;

// GET /api/showtimes?movie_id=&theatre_id=&date=&screen_id=&status=&city=
exports.getAllShowtimes = async (req, res) => {
  try {
    const { movie_id, theatre_id, date, screen_id, status, city } = req.query;
    let sql = BASE_SELECT;
    const where = [];
    const params = [];
    if (movie_id) { where.push('sh.movie_id = ?'); params.push(movie_id); }
    if (theatre_id) { where.push('sh.theatre_id = ?'); params.push(theatre_id); }
    if (screen_id) { where.push('sh.screen_id = ?'); params.push(screen_id); }
    if (date) { where.push('sh.show_date = ?'); params.push(date); }
    if (status) { where.push('sh.status = ?'); params.push(status); }
    if (city) { where.push('t.city = ?'); params.push(city); }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY sh.show_date, sh.start_time';
    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch showtimes' });
  }
};

// GET /api/showtimes/movie/:movieId  -> grouped by date, for Movie Detail page
exports.getShowtimesByMovie = async (req, res) => {
  try {
    const { city, date } = req.query;
    let sql = BASE_SELECT + ' WHERE sh.movie_id = ? AND sh.status = "scheduled" AND sh.show_date >= CURDATE()';
    const params = [req.params.movieId];
    if (city) { sql += ' AND t.city = ?'; params.push(city); }
    if (date) { sql += ' AND sh.show_date = ?'; params.push(date); }
    sql += ' ORDER BY sh.show_date, sh.start_time';
    const [rows] = await db.query(sql, params);

    const grouped = {};
    rows.forEach((r) => {
      grouped[r.show_date] = grouped[r.show_date] || [];
      grouped[r.show_date].push(r);
    });
    res.json({ success: true, data: grouped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch showtimes for movie' });
  }
};

// GET /api/showtimes/:id
exports.getShowtimeById = async (req, res) => {
  try {
    const [rows] = await db.query(BASE_SELECT + ' WHERE sh.id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Showtime not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch showtime' });
  }
};

// POST /api/showtimes (admin)
exports.createShowtime = async (req, res) => {
  try {
    const { movie_id, theatre_id, screen_id, show_date, start_time, end_time, language, format, ticket_price } = req.body;
    const [screenRows] = await db.query('SELECT capacity FROM screens WHERE id = ?', [screen_id]);
    if (screenRows.length === 0) return res.status(400).json({ success: false, message: 'Invalid screen' });

    const [result] = await db.query(
      `INSERT INTO showtimes (movie_id, theatre_id, screen_id, show_date, start_time, end_time, language, format, ticket_price, available_seats, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')`,
      [movie_id, theatre_id, screen_id, show_date, start_time, end_time, language || 'English', format || '2D', ticket_price, screenRows[0].capacity]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create showtime' });
  }
};

// PUT /api/showtimes/:id (admin)
exports.updateShowtime = async (req, res) => {
  try {
    const { movie_id, theatre_id, screen_id, show_date, start_time, end_time, language, format, ticket_price, status } = req.body;
    await db.query(
      `UPDATE showtimes SET movie_id=?, theatre_id=?, screen_id=?, show_date=?, start_time=?, end_time=?, language=?, format=?, ticket_price=?, status=? WHERE id=?`,
      [movie_id, theatre_id, screen_id, show_date, start_time, end_time, language, format, ticket_price, status, req.params.id]
    );
    res.json({ success: true, message: 'Showtime updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update showtime' });
  }
};

// DELETE /api/showtimes/:id (admin)
exports.deleteShowtime = async (req, res) => {
  try {
    await db.query('DELETE FROM showtimes WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Showtime deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete showtime' });
  }
};

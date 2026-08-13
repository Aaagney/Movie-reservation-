const db = require('../config/db');

// GET /api/reports/stats
exports.getStats = async (req, res) => {
  try {
    const [bookingsCount] = await db.query('SELECT COUNT(*) as count FROM bookings');
    const [revenueResult] = await db.query("SELECT SUM(total_price) as sum FROM bookings WHERE status = 'confirmed'");
    const [moviesCount] = await db.query('SELECT COUNT(*) as count FROM movies');
    const [usersCount] = await db.query('SELECT COUNT(*) as count FROM users');
    const [theatersCount] = await db.query('SELECT COUNT(*) as count FROM theaters');
    const [cancelledCount] = await db.query("SELECT COUNT(*) as count FROM bookings WHERE status = 'cancelled'");

    res.status(200).json({
      totalBookings: bookingsCount[0].count,
      totalRevenue: parseFloat(revenueResult[0].sum || 0).toFixed(2),
      totalMovies: moviesCount[0].count,
      totalUsers: usersCount[0].count,
      totalTheatres: theatersCount[0].count,
      totalCancelledBookings: cancelledCount[0].count
    });
  } catch (error) {
    console.error('Reports stats error:', error.message);
    res.status(500).json({ message: 'Server error fetching reports statistics' });
  }
};

// GET /api/reports/sales
exports.getSalesTrend = async (req, res) => {
  try {
    const { period = 'daily', startDate, endDate } = req.query;
    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = 'WHERE booking_date >= ? AND booking_date <= ?';
      params.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
    }

    let query = '';
    if (period === 'monthly') {
      query = `
        SELECT DATE_FORMAT(booking_date, '%Y-%m') as date, 
               SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as bookingsCount, 
               COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END), 0) as revenue 
        FROM bookings
        ${dateFilter}
        GROUP BY DATE_FORMAT(booking_date, '%Y-%m')
        ORDER BY date ASC
      `;
    } else if (period === 'weekly') {
      // In MySQL, %v (Mon-Sun week) or %u (Mon-Sun week) can be used.
      query = `
        SELECT DATE_FORMAT(booking_date, '%Y-W%u') as date, 
               SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as bookingsCount, 
               COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END), 0) as revenue 
        FROM bookings
        ${dateFilter}
        GROUP BY DATE_FORMAT(booking_date, '%Y-W%u')
        ORDER BY date ASC
      `;
    } else { // daily
      query = `
        SELECT DATE(booking_date) as date, 
               SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as bookingsCount, 
               COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END), 0) as revenue 
        FROM bookings
        ${dateFilter}
        GROUP BY DATE(booking_date)
        ORDER BY date ASC
      `;
    }

    const [rows] = await db.query(query, params);
    
    // Format rows to look neat in frontend
    const formatted = rows.map(r => ({
      date: r.date instanceof Date ? r.date.toISOString().split('T')[0] : r.date,
      bookingsCount: parseInt(r.bookingsCount || 0),
      revenue: parseFloat(r.revenue || 0).toFixed(2)
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Reports sales trend error:', error.message);
    res.status(500).json({ message: 'Server error fetching sales trend data' });
  }
};

// GET /api/reports/movie-wise
exports.getMovieWiseReport = async (req, res) => {
  try {
    const query = `
      SELECT m.id, m.title, m.genre,
             SUM(CASE WHEN b.id IS NOT NULL AND b.status = 'confirmed' THEN 1 ELSE 0 END) as bookingsCount,
             COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_price ELSE 0 END), 0) as revenue
      FROM movies m
      LEFT JOIN showtimes s ON s.movie_id = m.id
      LEFT JOIN bookings b ON b.showtime_id = s.id
      GROUP BY m.id, m.title, m.genre
      ORDER BY revenue DESC
    `;
    const [rows] = await db.query(query);
    const formatted = rows.map(r => ({
      ...r,
      bookingsCount: parseInt(r.bookingsCount || 0),
      revenue: parseFloat(r.revenue || 0).toFixed(2)
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error('Reports movie-wise error:', error.message);
    res.status(500).json({ message: 'Server error fetching movie-wise reports' });
  }
};

// GET /api/reports/theatre-wise
exports.getTheatreWiseReport = async (req, res) => {
  try {
    const query = `
      SELECT t.id, t.name, t.capacity_desc,
             SUM(CASE WHEN b.id IS NOT NULL AND b.status = 'confirmed' THEN 1 ELSE 0 END) as bookingsCount,
             COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_price ELSE 0 END), 0) as revenue
      FROM theaters t
      LEFT JOIN showtimes s ON s.theater_id = t.id
      LEFT JOIN bookings b ON b.showtime_id = s.id
      GROUP BY t.id, t.name, t.capacity_desc
      ORDER BY revenue DESC
    `;
    const [rows] = await db.query(query);
    const formatted = rows.map(r => ({
      ...r,
      bookingsCount: parseInt(r.bookingsCount || 0),
      revenue: parseFloat(r.revenue || 0).toFixed(2)
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error('Reports theatre-wise error:', error.message);
    res.status(500).json({ message: 'Server error fetching theatre-wise reports' });
  }
};

// GET /api/reports/bookings-list
exports.getBookingsList = async (req, res) => {
  try {
    const { search, startDate, endDate, page = 1, limit = 10 } = req.query;
    const limitVal = parseInt(limit);
    const offsetVal = (parseInt(page) - 1) * limitVal;

    let whereClauses = [];
    let params = [];

    if (search) {
      whereClauses.push('(b.id LIKE ? OR u.name LIKE ? OR m.title LIKE ?)');
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (startDate) {
      whereClauses.push('b.booking_date >= ?');
      params.push(`${startDate} 00:00:00`);
    }

    if (endDate) {
      whereClauses.push('b.booking_date <= ?');
      params.push(`${endDate} 23:59:59`);
    }

    const whereSql = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    // Count query
    const countQuery = `
      SELECT COUNT(*) as count
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN theaters t ON s.theater_id = t.id
      ${whereSql}
    `;
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].count;

    // Data query
    const dataQuery = `
      SELECT b.id as booking_id, b.total_price, b.status, b.booking_date,
             u.name as user_name, u.email as user_email,
             m.title as movie_title,
             t.name as theater_name,
             s.start_time as show_time
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN theaters t ON s.theater_id = t.id
      ${whereSql}
      ORDER BY b.booking_date DESC
      LIMIT ? OFFSET ?
    `;
    
    // Add pagination arguments to parameters array
    const [rows] = await db.query(dataQuery, [...params, limitVal, offsetVal]);
    
    const formatted = rows.map(r => ({
      ...r,
      total_price: parseFloat(r.total_price).toFixed(2)
    }));

    res.status(200).json({
      data: formatted,
      pagination: {
        total,
        page: parseInt(page),
        limit: limitVal,
        totalPages: Math.ceil(total / limitVal)
      }
    });
  } catch (error) {
    console.error('Reports bookings list error:', error.message);
    res.status(500).json({ message: 'Server error fetching reports booking records' });
  }
};

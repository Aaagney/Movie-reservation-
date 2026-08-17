const db = require('../config/db');

// GET /api/dashboard/stats
exports.getStats = async (req, res) => {
  try {
    const [[{ totalTheatres }]] = await db.query('SELECT COUNT(*) as totalTheatres FROM theatres');
    const [[{ totalScreens }]] = await db.query('SELECT COUNT(*) as totalScreens FROM screens');
    const [[{ todaysShows }]] = await db.query('SELECT COUNT(*) as todaysShows FROM showtimes WHERE show_date = CURDATE()');
    const [[{ activeMovies }]] = await db.query("SELECT COUNT(*) as activeMovies FROM movies WHERE status = 'now_showing'");
    const [[{ bookingsToday }]] = await db.query('SELECT COUNT(*) as bookingsToday FROM bookings WHERE DATE(booked_at) = CURDATE()');
    const [[{ totalBookings }]] = await db.query('SELECT COUNT(*) as totalBookings FROM bookings');
    const [[{ totalRevenue }]] = await db.query("SELECT COALESCE(SUM(total_amount),0) as totalRevenue FROM bookings WHERE booking_status = 'confirmed'");

    res.json({
      success: true,
      data: {
        totalTheatres,
        totalScreens,
        todaysShows,
        activeMovies,
        bookingsToday,
        totalBookings,
        totalRevenue,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};

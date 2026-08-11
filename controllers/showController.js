// controllers/showController.js
const { query } = require('../database/db');

// GET /api/shows/:movieId
// Returns every show for a movie, joined with theatre details so the
// frontend can render "Select Theatre" and "Select Show" in one call.
async function getShowsByMovie(req, res) {
  try {
    const { movieId } = req.params;

    const result = await query(
      `SELECT s.id AS show_id, s.show_time, s.show_date, s.price,
              t.id AS theatre_id, t.name AS theatre_name, t.location, t.screens
       FROM shows s
       JOIN theatres t ON t.id = s.theatre_id
       WHERE s.movie_id = $1
       ORDER BY t.name ASC,
                CASE s.show_time
                  WHEN 'Morning' THEN 1
                  WHEN 'Afternoon' THEN 2
                  WHEN 'Evening' THEN 3
                  WHEN 'Night' THEN 4
                  ELSE 5
                END`,
      [movieId]
    );

    res.json({ success: true, shows: result.rows });
  } catch (err) {
    console.error('getShowsByMovie error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch shows' });
  }
}

module.exports = { getShowsByMovie };

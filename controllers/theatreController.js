// controllers/theatreController.js
const { query } = require('../database/db');

// GET /api/theatres
// Optionally GET /api/theatres?movieId=3 to only show theatres screening that movie.
async function getTheatres(req, res) {
  try {
    const { movieId } = req.query;
    let result;

    if (movieId) {
      result = await query(
        `SELECT DISTINCT t.*
         FROM theatres t
         JOIN shows s ON s.theatre_id = t.id
         WHERE s.movie_id = $1
         ORDER BY t.name ASC`,
        [movieId]
      );
    } else {
      result = await query(`SELECT * FROM theatres ORDER BY name ASC`);
    }

    res.json({ success: true, theatres: result.rows });
  } catch (err) {
    console.error('getTheatres error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch theatres' });
  }
}

module.exports = { getTheatres };

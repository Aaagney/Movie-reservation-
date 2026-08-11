// controllers/movieController.js
const { query } = require('../database/db');

// GET /api/movies?search=title
// Returns all movies, or movies whose title matches the ?search term (case-insensitive).
async function getMovies(req, res) {
  try {
    const { search } = req.query;
    let result;

    if (search && search.trim().length > 0) {
      result = await query(
        `SELECT * FROM movies WHERE title ILIKE $1 ORDER BY title ASC`,
        [`%${search.trim()}%`]
      );
    } else {
      result = await query(`SELECT * FROM movies ORDER BY created_at DESC`);
    }

    res.json({ success: true, movies: result.rows });
  } catch (err) {
    console.error('getMovies error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch movies' });
  }
}

// GET /api/movies/:id
async function getMovieById(req, res) {
  try {
    const { id } = req.params;
    const result = await query(`SELECT * FROM movies WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    res.json({ success: true, movie: result.rows[0] });
  } catch (err) {
    console.error('getMovieById error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch movie' });
  }
}

module.exports = { getMovies, getMovieById };

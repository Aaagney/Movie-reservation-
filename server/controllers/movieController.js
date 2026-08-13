const db = require('../config/db');

exports.getMovies = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM movies ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const [movies] = await db.query('SELECT * FROM movies WHERE id = ?', [id]);
    if (movies.length === 0) return res.status(404).json({ message: 'Movie not found' });

    const [showtimes] = await db.query('SELECT * FROM showtimes WHERE movie_id = ? ORDER BY show_date, show_time', [id]);

    res.json({ ...movies[0], showtimes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
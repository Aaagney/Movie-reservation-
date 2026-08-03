const db = require('../config/db');

async function attachGenres(movies) {
  if (movies.length === 0) return movies;
  const ids = movies.map((m) => m.id);
  const [genreRows] = await db.query(
    `SELECT mg.movie_id, g.name FROM movie_genres mg JOIN genres g ON mg.genre_id = g.id WHERE mg.movie_id IN (?)`,
    [ids]
  );
  const byMovie = {};
  genreRows.forEach((r) => {
    byMovie[r.movie_id] = byMovie[r.movie_id] || [];
    byMovie[r.movie_id].push(r.name);
  });
  return movies.map((m) => ({ ...m, genres: byMovie[m.id] || [] }));
}

// GET /api/movies?search=&genre=&status=
exports.getAllMovies = async (req, res) => {
  try {
    const { search, genre, status, language } = req.query;
    let sql = `SELECT DISTINCT m.* FROM movies m`;
    const params = [];
    const where = [];

    if (genre) {
      sql += ` JOIN movie_genres mg ON mg.movie_id = m.id JOIN genres g ON g.id = mg.genre_id`;
      where.push('g.name = ?');
      params.push(genre);
    }
    if (search) {
      where.push('(m.title LIKE ? OR m.director LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status) {
      where.push('m.status = ?');
      params.push(status);
    }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY m.created_at DESC';

    const [movies] = await db.query(sql, params);
    const withGenres = await attachGenres(movies);
    res.json({ success: true, data: withGenres });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch movies' });
  }
};

// GET /api/movies/:id
exports.getMovieById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Movie not found' });
    const withGenres = await attachGenres(rows);
    res.json({ success: true, data: withGenres[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch movie' });
  }
};

// POST /api/movies (admin)
exports.createMovie = async (req, res) => {
  try {
    const { title, description, poster_url, rating, duration_minutes, director, cast_list, release_date, status, genre_ids } = req.body;
    const [result] = await db.query(
      `INSERT INTO movies (title, description, poster_url, rating, duration_minutes, director, cast_list, release_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, poster_url, rating || 'PG-13', duration_minutes || 120, director, cast_list, release_date, status || 'now_showing']
    );
    if (Array.isArray(genre_ids) && genre_ids.length) {
      const values = genre_ids.map((gid) => [result.insertId, gid]);
      await db.query('INSERT INTO movie_genres (movie_id, genre_id) VALUES ?', [values]);
    }
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create movie' });
  }
};

// PUT /api/movies/:id (admin)
exports.updateMovie = async (req, res) => {
  try {
    const { title, description, poster_url, rating, duration_minutes, director, cast_list, release_date, status } = req.body;
    await db.query(
      `UPDATE movies SET title=?, description=?, poster_url=?, rating=?, duration_minutes=?, director=?, cast_list=?, release_date=?, status=? WHERE id=?`,
      [title, description, poster_url, rating, duration_minutes, director, cast_list, release_date, status, req.params.id]
    );
    res.json({ success: true, message: 'Movie updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update movie' });
  }
};

// DELETE /api/movies/:id (admin)
exports.deleteMovie = async (req, res) => {
  try {
    await db.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Movie deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete movie' });
  }
};

// GET /api/genres
exports.getGenres = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM genres ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch genres' });
  }
};

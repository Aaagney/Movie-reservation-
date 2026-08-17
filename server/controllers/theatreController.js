const db = require('../config/db');

// GET /api/theatres?city=&search=
exports.getAllTheatres = async (req, res) => {
  try {
    const { city, search, status } = req.query;
    let sql = 'SELECT * FROM theatres';
    const where = [];
    const params = [];
    if (city) { where.push('city = ?'); params.push(city); }
    if (status) { where.push('status = ?'); params.push(status); }
    if (search) { where.push('(name LIKE ? OR city LIKE ? OR location LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY name';
    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch theatres' });
  }
};

// GET /api/theatres/:id  (includes its screens)
exports.getTheatreById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM theatres WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Theatre not found' });
    const [screens] = await db.query(
      `SELECT s.*, st.name as screen_type FROM screens s JOIN screen_types st ON s.screen_type_id = st.id WHERE s.theatre_id = ?`,
      [req.params.id]
    );
    res.json({ success: true, data: { ...rows[0], screens } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch theatre' });
  }
};

// POST /api/theatres (admin)
exports.createTheatre = async (req, res) => {
  try {
    const { name, location, city, address, phone, email, status, has_parking, has_food_court, has_wheelchair_access, has_ac } = req.body;
    const [result] = await db.query(
      `INSERT INTO theatres (name, location, city, address, phone, email, status, has_parking, has_food_court, has_wheelchair_access, has_ac)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, location, city, address, phone, email, status || 'active', !!has_parking, !!has_food_court, !!has_wheelchair_access, has_ac === undefined ? true : !!has_ac]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create theatre' });
  }
};

// PUT /api/theatres/:id (admin)
exports.updateTheatre = async (req, res) => {
  try {
    const { name, location, city, address, phone, email, status, has_parking, has_food_court, has_wheelchair_access, has_ac } = req.body;
    await db.query(
      `UPDATE theatres SET name=?, location=?, city=?, address=?, phone=?, email=?, status=?, has_parking=?, has_food_court=?, has_wheelchair_access=?, has_ac=? WHERE id=?`,
      [name, location, city, address, phone, email, status, !!has_parking, !!has_food_court, !!has_wheelchair_access, !!has_ac, req.params.id]
    );
    res.json({ success: true, message: 'Theatre updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update theatre' });
  }
};

// DELETE /api/theatres/:id (admin)
exports.deleteTheatre = async (req, res) => {
  try {
    await db.query('DELETE FROM theatres WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Theatre deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete theatre' });
  }
};

// GET /api/theatres/cities/list
exports.getCities = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT city FROM theatres ORDER BY city');
    res.json({ success: true, data: rows.map((r) => r.city) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch cities' });
  }
};

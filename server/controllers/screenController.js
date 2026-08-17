const db = require('../config/db');

function generateSeatsForScreen(screenId, rows, columns) {
  const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const values = [];
  for (let r = 0; r < rows; r++) {
    const isVipRow = r === rows - 1;
    for (let c = 1; c <= columns; c++) {
      values.push([screenId, rowLetters[r], c, isVipRow ? 'vip' : 'standard']);
    }
  }
  return values;
}

// GET /api/screens?theatre_id=
exports.getAllScreens = async (req, res) => {
  try {
    const { theatre_id } = req.query;
    let sql = `SELECT s.*, st.name as screen_type, t.name as theatre_name
               FROM screens s
               JOIN screen_types st ON s.screen_type_id = st.id
               JOIN theatres t ON s.theatre_id = t.id`;
    const params = [];
    if (theatre_id) {
      sql += ' WHERE s.theatre_id = ?';
      params.push(theatre_id);
    }
    sql += ' ORDER BY t.name, s.screen_number';
    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch screens' });
  }
};

// GET /api/screens/:id
exports.getScreenById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, st.name as screen_type, t.name as theatre_name
       FROM screens s JOIN screen_types st ON s.screen_type_id = st.id JOIN theatres t ON s.theatre_id = t.id
       WHERE s.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Screen not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch screen' });
  }
};

// POST /api/screens (admin) - auto-generates seats
exports.createScreen = async (req, res) => {
  try {
    const { theatre_id, screen_name, screen_number, rows_count, columns_count, screen_type_id } = req.body;
    const capacity = rows_count * columns_count;
    const [result] = await db.query(
      `INSERT INTO screens (theatre_id, screen_name, screen_number, capacity, rows_count, columns_count, screen_type_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [theatre_id, screen_name, screen_number, capacity, rows_count, columns_count, screen_type_id]
    );
    const seatValues = generateSeatsForScreen(result.insertId, rows_count, columns_count);
    await db.query('INSERT INTO seats (screen_id, seat_row, seat_number, seat_type) VALUES ?', [seatValues]);
    res.status(201).json({ success: true, data: { id: result.insertId, capacity } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create screen' });
  }
};

// PUT /api/screens/:id (admin)
exports.updateScreen = async (req, res) => {
  try {
    const { screen_name, screen_number, screen_type_id } = req.body;
    await db.query(
      `UPDATE screens SET screen_name=?, screen_number=?, screen_type_id=? WHERE id=?`,
      [screen_name, screen_number, screen_type_id, req.params.id]
    );
    res.json({ success: true, message: 'Screen updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update screen' });
  }
};

// DELETE /api/screens/:id (admin)
exports.deleteScreen = async (req, res) => {
  try {
    await db.query('DELETE FROM screens WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Screen deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete screen' });
  }
};

// GET /api/screens/types/list
exports.getScreenTypes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM screen_types ORDER BY id');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch screen types' });
  }
};

const db = require('../config/db');

// GET /api/audit-logs
exports.getAuditLogs = async (req, res) => {
  try {
    const { search, action, startDate, endDate, page = 1, limit = 10 } = req.query;
    const limitVal = parseInt(limit);
    const offsetVal = (parseInt(page) - 1) * limitVal;

    let whereClauses = [];
    let params = [];

    if (search) {
      whereClauses.push('(user_name LIKE ? OR description LIKE ? OR module LIKE ?)');
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (action) {
      whereClauses.push('action = ?');
      params.push(action);
    }

    if (startDate) {
      whereClauses.push('created_at >= ?');
      params.push(`${startDate} 00:00:00`);
    }

    if (endDate) {
      whereClauses.push('created_at <= ?');
      params.push(`${endDate} 23:59:59`);
    }

    const whereSql = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    // Count query
    const countQuery = `SELECT COUNT(*) as count FROM audit_logs ${whereSql}`;
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].count;

    // Data query
    const dataQuery = `
      SELECT id, user_name, action, module, description, created_at, ip_address
      FROM audit_logs
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.query(dataQuery, [...params, limitVal, offsetVal]);

    res.status(200).json({
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: limitVal,
        totalPages: Math.ceil(total / limitVal)
      }
    });
  } catch (error) {
    console.error('Audit logs fetch error:', error.message);
    res.status(500).json({ message: 'Server error fetching audit logs' });
  }
};

// POST /api/audit-logs
exports.createAuditLog = async (req, res) => {
  try {
    const { userName, action, module, description, ipAddress } = req.body;

    if (!userName || !action || !module || !description) {
      return res.status(400).json({ message: 'Missing required fields for audit log' });
    }

    const query = `
      INSERT INTO audit_logs (user_name, action, module, description, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `;
    const ip = ipAddress || req.ip || '127.0.0.1';
    const [result] = await db.query(query, [userName, action, module, description, ip]);

    res.status(201).json({
      message: 'Audit log created successfully',
      logId: result.insertId
    });
  } catch (error) {
    console.error('Audit logs create error:', error.message);
    res.status(500).json({ message: 'Server error logging audit event' });
  }
};

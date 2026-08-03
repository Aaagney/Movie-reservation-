// Dummy authentication middleware - no JWT required per project spec.
// The frontend sends the logged-in user's role via the 'x-user-role' header
// after a successful dummy login. This is intentionally simple for a
// college project and should not be used as real security.

function requireAdmin(req, res, next) {
  const role = req.headers['x-user-role'];
  if (role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}

module.exports = { requireAdmin };

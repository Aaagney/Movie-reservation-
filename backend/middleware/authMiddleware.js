const jwt = require("jsonwebtoken");

// Verifies the JWT sent in the Authorization header.
// Attaches the decoded user payload to req.user for downstream routes.
function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized. Please sign in." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired. Please sign in again." });
  }
}

// Restricts a route to specific roles, e.g. requireRole("admin")
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to access this resource." });
    }
    next();
  };
}

module.exports = { protect, requireRole };

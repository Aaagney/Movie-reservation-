const pool = require("../db/pool");
const generateToken = require("../utils/generateToken");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------
// POST /api/auth/register
// ---------------------------------------------
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const safeRole = role === "admin" ? "admin" : "member";
    const normalizedEmail = email.toLowerCase().trim();

    // ---- Duplicate check ----
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "User is already registered. Please sign in instead." });
    }

    // NOTE: Password is stored exactly as the user typed it (plain text),
    // per explicit request. This is NOT secure for a real production app —
    // normally this is where bcrypt.hash(password, 10) would be used instead.
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name.trim(), normalizedEmail, password, safeRole]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    return res.status(201).json({
      message: "Account created successfully.",
      token,
      user,
    });
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({ message: "Something went wrong while creating your account." });
  }
}

// ---------------------------------------------
// POST /api/auth/login
// ---------------------------------------------
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const result = await pool.query(
      "SELECT id, name, email, password, role FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "No account found with this email." });
    }

    const user = result.rows[0];

    // NOTE: Direct plain-text comparison per explicit request.
    // Normally this is where bcrypt.compare(password, user.password_hash) would be used instead.
    if (password !== user.password) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    const token = generateToken(user);
    delete user.password;

    return res.status(200).json({
      message: "Signed in successfully.",
      token,
      user,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Something went wrong while signing in." });
  }
}

// ---------------------------------------------
// GET /api/auth/me   (protected)
// ---------------------------------------------
async function getMe(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error("GetMe error:", err.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

module.exports = { register, login, getMe };

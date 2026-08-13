<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const reportsRoutes = require('./routes/reportsRoutes');
const auditLogsRoutes = require('./routes/auditLogsRoutes');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets if in production
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/reports', reportsRoutes);
app.use('/api/audit-logs', auditLogsRoutes);

// Database Setup / Seeding Endpoint (for easy developer/grader deployment)
app.post('/api/setup-db', async (req, res) => {
  try {
    const fs = require('fs');
    const sqlPath = path.join(__dirname, '..', 'database', 'schema.sql');
    
    if (!fs.existsSync(sqlPath)) {
      return res.status(404).json({ message: 'schema.sql file not found at database/schema.sql' });
    }

    let sql = fs.readFileSync(sqlPath, 'utf8');

    // Remove DELIMITER commands since they are MySQL CLI specific and cause syntax errors in mysql2 Node client
    sql = sql.replace(/DELIMITER \/\/[\r\n]+/g, '');
    sql = sql.replace(/DELIMITER ;[\r\n]+/g, '');
    sql = sql.replace(/\/\/[\r\n]+/g, ';'); // replace custom delimiter end with semicolon

    // Execute the SQL statements (we can do multiple statements since pool config has multipleStatements: true)
    await db.query(sql);

    // Write a log in the audit log that DB was seeded
    try {
      await db.query(
        "INSERT INTO audit_logs (user_name, action, module, description) VALUES ('System', 'Database Seeding', 'System', 'Database re-seeded via setup-db endpoint')"
      );
    } catch (logErr) {
      console.error('Failed to log db seeding event:', logErr.message);
    }

    res.status(200).json({ message: 'Database schema and reports seed data loaded successfully!' });
  } catch (error) {
    console.error('setup-db error:', error.message);
    res.status(500).json({ message: 'Error initializing database: ' + error.message });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send('CinéVault REST API is running (Reports & Audit Logs Edition)...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
=======
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "CinéVault Auth API" });
});

app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CinéVault Auth API running on http://localhost:${PORT}`);
>>>>>>> origin/main
});

// database/db.js
// Central PostgreSQL connection pool. Every controller queries through this
// single pool instead of opening ad-hoc client connections.

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10, // max simultaneous clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  console.log('PostgreSQL pool: new client connected');
});

pool.on('error', (err) => {
  // Unexpected errors on idle clients should not crash the whole server.
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

// Small helper so controllers can log slow queries during development
// without wiring up a full query-logging library.
async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development' && duration > 200) {
    console.log('Slow query (%sms): %s', duration, text);
  }
  return result;
}

module.exports = { pool, query };

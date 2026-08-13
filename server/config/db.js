<<<<<<< HEAD
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
=======
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cinevault',
  waitForConnections: true,
  connectionLimit: 10,
<<<<<<< HEAD
  queueLimit: 0,
  dateStrings: true,
});

module.exports = pool;
=======
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to MySQL Database (Cinévault)');
    connection.release();
  }
});

module.exports = db;
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481

// server.js — CineVault API entry point
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require("path");

const moviesRouter = require('./routes/movies');
const theatresRouter = require('./routes/theatres');
const showsRouter = require('./routes/shows');
const seatsRouter = require('./routes/seats');
const bookingsRouter = require('./routes/bookings');
const foodRouter = require('./routes/food');

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------------------------
// Global middleware
// ------------------------------------------------------------
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));
// Simple request logger — helpful while wiring up the frontend.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// ------------------------------------------------------------
// Routes
// ------------------------------------------------------------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
app.use('/api/movies', moviesRouter);
app.use('/api/theatres', theatresRouter);
app.use('/api/shows', showsRouter);
app.use('/api/seats', seatsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/food', foodRouter);

// ------------------------------------------------------------
// 404 handler
// ------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ------------------------------------------------------------
// Central error handler
// ------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`CineVault API listening on http://localhost:${PORT}`);
});

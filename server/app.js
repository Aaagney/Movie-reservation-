const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const screenRoutes = require('./routes/screenRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');
const seatRoutes = require('./routes/seatRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ success: true, message: 'CineVault API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/screens', screenRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`CineVault API server running on http://localhost:${PORT}`);
});

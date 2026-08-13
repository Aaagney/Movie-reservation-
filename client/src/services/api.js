import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getMovies = () => API.get('/movies');
export const getMovieById = (id) => API.get(`/movies/${id}`);
export const getShowtimeSeats = (showtimeId) => API.get(`/bookings/showtimes/${showtimeId}/seats`);

// Create new booking (matches app.post('/api/bookings') in server.js)
export const confirmBooking = (data) => API.post('/bookings', data);

// Fetch user bookings
export const getUserBookings = (username) => API.get(`/bookings/user/${username}`);

// Cancel booking (matches app.post('/api/bookings/cancel/:id') in server.js)
export const cancelBooking = (id) => API.post(`/bookings/cancel/${id}`);
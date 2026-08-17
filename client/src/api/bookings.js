import client from './client';

export const createBooking = (payload) => client.post('/bookings', payload).then((r) => r.data);
export const getBookingById = (id) => client.get(`/bookings/${id}`).then((r) => r.data.data);
export const getBookings = (params = {}) => client.get('/bookings', { params }).then((r) => r.data.data);

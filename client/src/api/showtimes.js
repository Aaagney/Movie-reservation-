import client from './client';

export const getShowtimes = (params = {}) => client.get('/showtimes', { params }).then((r) => r.data.data);
export const getShowtimesByMovie = (movieId, params = {}) =>
  client.get(`/showtimes/movie/${movieId}`, { params }).then((r) => r.data.data);
export const getShowtimeById = (id) => client.get(`/showtimes/${id}`).then((r) => r.data.data);
export const createShowtime = (payload) => client.post('/showtimes', payload).then((r) => r.data);
export const updateShowtime = (id, payload) => client.put(`/showtimes/${id}`, payload).then((r) => r.data);
export const deleteShowtime = (id) => client.delete(`/showtimes/${id}`).then((r) => r.data);

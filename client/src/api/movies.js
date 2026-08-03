import client from './client';

export const getMovies = (params = {}) => client.get('/movies', { params }).then((r) => r.data.data);
export const getMovieById = (id) => client.get(`/movies/${id}`).then((r) => r.data.data);
export const getGenres = () => client.get('/movies/genres/list').then((r) => r.data.data);
export const createMovie = (payload) => client.post('/movies', payload).then((r) => r.data);
export const updateMovie = (id, payload) => client.put(`/movies/${id}`, payload).then((r) => r.data);
export const deleteMovie = (id) => client.delete(`/movies/${id}`).then((r) => r.data);

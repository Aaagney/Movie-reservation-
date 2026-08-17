import client from './client';

export const getTheatres = (params = {}) => client.get('/theatres', { params }).then((r) => r.data.data);
export const getTheatreById = (id) => client.get(`/theatres/${id}`).then((r) => r.data.data);
export const getCities = () => client.get('/theatres/cities/list').then((r) => r.data.data);
export const createTheatre = (payload) => client.post('/theatres', payload).then((r) => r.data);
export const updateTheatre = (id, payload) => client.put(`/theatres/${id}`, payload).then((r) => r.data);
export const deleteTheatre = (id) => client.delete(`/theatres/${id}`).then((r) => r.data);

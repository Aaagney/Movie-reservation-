import client from './client';

export const getScreens = (params = {}) => client.get('/screens', { params }).then((r) => r.data.data);
export const getScreenById = (id) => client.get(`/screens/${id}`).then((r) => r.data.data);
export const getScreenTypes = () => client.get('/screens/types/list').then((r) => r.data.data);
export const createScreen = (payload) => client.post('/screens', payload).then((r) => r.data);
export const updateScreen = (id, payload) => client.put(`/screens/${id}`, payload).then((r) => r.data);
export const deleteScreen = (id) => client.delete(`/screens/${id}`).then((r) => r.data);

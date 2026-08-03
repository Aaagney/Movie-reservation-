import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach dummy role header for admin-protected routes
client.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('cinevault_user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    config.headers['x-user-role'] = user.role;
  }
  return config;
});

export default client;

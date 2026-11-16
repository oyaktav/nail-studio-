import axios from 'axios';

export const API_URL = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');

const api = axios.create({
  baseURL: `${API_URL}/api/`,
});

export default api;
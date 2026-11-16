import axios from 'axios';

const api = axios.create({
  // Mudamos de 8000 para 8001 para bater com o servidor que você ligou
  baseURL: 'http://127.0.0.1:8000/api/', 
});

export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  const captchaToken = (window as any).captchaToken;
  if (captchaToken) {
    config.headers['X-Recaptcha-Token'] = captchaToken;
  }
  
  return config;
});

export default api;

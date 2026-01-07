import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors - expose backend errors directly for misconfiguration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      // Don't redirect on network errors for auth endpoints
      if (!error.config?.url?.includes('/auth/')) {
        if (error.config?.url && !error.config.url.includes('/auth/')) {
          // Only redirect if we have a token (means we were authenticated)
          const token = localStorage.getItem('token');
          if (token) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject({
        ...error,
        message: error.message || 'Network error. Please check if the backend server is running.',
      });
    }

    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login/register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }

    // Expose full backend error details for misconfiguration
    console.error('Backend Error Details:', error.response?.data);
    alert('Error: ' + JSON.stringify(error.response?.data, null, 2)); // Display raw error for misconfiguration

    return Promise.reject(error);
  }
);

export default api;


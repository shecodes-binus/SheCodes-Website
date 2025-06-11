// /SheCodes-Website-main/lib/apiService.ts
import axios from 'axios';

// Get the backend URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to every request
apiService.interceptors.request.use(
  (config) => {
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Interceptor to handle 401 Unauthorized errors (e.g., redirect to login)
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiService;
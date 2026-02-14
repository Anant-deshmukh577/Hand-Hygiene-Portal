import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance with timeout configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout to prevent hanging requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry configuration for failed requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

// Helper to wait between retries
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Request interceptor - adds auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For file uploads (FormData), don't set Content-Type
    // Let the browser set it automatically with proper boundary
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    } else {
      // Remove Content-Type for FormData - browser will set it automatically
      delete config.headers['Content-Type'];
    }
    
    // Track retry attempts
    config.retryCount = config.retryCount || 0;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles errors and implements retry logic
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const config = error.config;
    
    // Handle rate limiting (429) with exponential backoff
    if (error.response?.status === 429) {
      if (config.retryCount < MAX_RETRIES) {
        config.retryCount += 1;
        const delayTime = RETRY_DELAY * Math.pow(2, config.retryCount - 1); // Exponential backoff
        
        await wait(delayTime);
        return api(config);
      } else {
        return Promise.reject(new Error('Too many requests. Please wait a moment and try again.'));
      }
    }
    
    // Handle network errors with retry
    if (!error.response && config.retryCount < MAX_RETRIES) {
      config.retryCount += 1;
      
      await wait(RETRY_DELAY);
      return api(config);
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please check your connection and try again.'));
    }
    
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Handle unauthorized access - redirect to login
    // Skip redirect for auth endpoints to avoid loops
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                           error.config?.url?.includes('/auth/admin-login') ||
                           error.config?.url?.includes('/auth/auditor-login') ||
                           error.config?.url?.includes('/auth/register') ||
                           error.config?.url?.includes('/auth/google');
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(new Error(message));
  }
);

export default api;
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, FALLBACK_API_BASE_URL } from '../utils/constants';

// Create axios instance with timeout configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout for network stability
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry configuration for failed requests
const MAX_RETRIES = 1; // Reduced retries for faster failure
const RETRY_DELAY = 500; // 500ms base delay

// Helper to wait between retries
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Request interceptor - adds auth token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[API] Error getting token:', error);
    }
    
    // For file uploads (FormData), let React Native handle Content-Type
    if (config.data instanceof FormData) {
      // Remove Content-Type header - React Native will set it with proper boundary
      if (config.headers.delete) {
        config.headers.delete('Content-Type');
      } else {
        delete config.headers['Content-Type'];
      }
      if (__DEV__) {
        console.log('[API] FormData detected, removed Content-Type header');
      }
    } else {
      if (config.headers.set) {
        config.headers.set('Content-Type', 'application/json');
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    
    // Track retry attempts
    config.retryCount = config.retryCount || 0;
    
    if (__DEV__) {
      console.log('[API] Request:', {
        method: config.method,
        url: config.url,
        hasFormData: config.data instanceof FormData,
        headers: config.headers,
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles errors and implements retry logic
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log('[API] Success:', response.config.url);
    }
    return response.data;
  },
  async (error) => {
    const config = error.config;
    
    if (__DEV__) {
      console.error('[API] Error:', {
        url: config?.url,
        method: config?.method,
        status: error.response?.status,
        message: error.message,
        code: error.code,
      });
    }
    
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
    
    if (!error.response && config.retryCount < MAX_RETRIES) {
      config.retryCount += 1;
      if (__DEV__) {
        console.log('[API] Retrying request, attempt:', config.retryCount);
      }
      
      await wait(RETRY_DELAY);
      return api(config);
    }

    if (!error.response && FALLBACK_API_BASE_URL && !config._fallbackUsed) {
      config._fallbackUsed = true;
      config.baseURL = FALLBACK_API_BASE_URL;
      return api(config);
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please check your connection and try again.'));
    }
    
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Handle unauthorized access
    // Skip redirect for auth endpoints to avoid loops
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                           error.config?.url?.includes('/auth/admin-login') ||
                           error.config?.url?.includes('/auth/auditor-login') ||
                           error.config?.url?.includes('/auth/register') ||
                           error.config?.url?.includes('/auth/google');
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      try {
        await SecureStore.deleteItemAsync('token');
      } catch (e) {
        if (__DEV__) {
          console.error('[API] Error deleting token:', e);
        }
      }
      // Navigation will be handled by AuthContext
    }
    
    return Promise.reject(new Error(message));
  }
);

export default api;

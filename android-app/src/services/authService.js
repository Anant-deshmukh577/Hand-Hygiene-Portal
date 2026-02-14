import api from './api';

export const authService = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },

  // Admin Login
  adminLogin: async (credentials) => {
    const response = await api.post('/auth/admin-login', credentials);
    return response;
  },

  // Auditor Login
  auditorLogin: async (credentials) => {
    const response = await api.post('/auth/auditor-login', credentials);
    return response;
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response;
  },

  // Google login
  googleLogin: async (idToken) => {
    const response = await api.post('/auth/google', { idToken });
    return response;
  },
};

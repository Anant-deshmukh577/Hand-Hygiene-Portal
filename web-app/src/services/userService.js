import api from './api';

export const userService = {
  // Get user profile
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response;
  },

  // Update profile
  updateProfile: async (userId, data) => {
    const response = await api.put(`/users/${userId}`, data);
    return response;
  },

  // Get user stats
  getUserStats: async (userId) => {
    const response = await api.get(`/users/${userId}/stats`);
    return response;
  },

  // Get user activity
  getUserActivity: async (userId) => {
    const response = await api.get(`/users/${userId}/activity`);
    return response;
  },

  // Change password
  changePassword: async (data) => {
    const response = await api.post('/users/change-password', data);
    return response;
  },

  // Upload avatar
  uploadAvatar: async (userId, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post(`/users/${userId}/avatar`, formData);
    return response;
  },

  // Delete avatar
  deleteAvatar: async (userId) => {
    const response = await api.delete(`/users/${userId}/avatar`);
    return response;
  },

  // Get all users (admin)
  getAllUsers: async (params) => {
    const response = await api.get('/users', { params });
    return response;
  },

  // Create user (admin)
  createUser: async (data) => {
    const response = await api.post('/users', data);
    return response;
  },

  // Get staff users (auditor/admin)
  getStaffUsers: async (params) => {
    const response = await api.get('/users/staff', { params });
    return response;
  },

  // Delete user (admin)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response;
  },

  // Update user role (admin)
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response;
  },

  // Toggle user status (admin)
  toggleUserStatus: async (userId) => {
    const response = await api.put(`/users/${userId}/toggle-status`);
    return response;
  },
};

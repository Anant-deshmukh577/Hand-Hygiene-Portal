import api from './api';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../utils/constants';

export const userService = {
  // Get all users
  getUsers: async (filters = {}) => {
    const response = await api.get('/users', { params: filters });
    return response;
  },

  // Get all users with pagination (admin only)
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response;
  },

  // Get staff users (for observation form)
  getStaffUsers: async () => {
    const response = await api.get('/users/staff');
    return response;
  },

  // Get single user
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response;
  },

  // Create user (admin only)
  createUser: async (data) => {
    const response = await api.post('/users', data);
    return response;
  },

  // Update user
  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response;
  },

  // Toggle user status (admin only)
  toggleUserStatus: async (id) => {
    const response = await api.put(`/users/${id}/toggle-status`);
    return response;
  },

  // Update user role (admin only)
  updateUserRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response;
  },

  // Update profile
  updateProfile: async (userId, data) => {
    const response = await api.put(`/users/${userId}`, data);
    return response;
  },

  // Change password
  changePassword: async (data) => {
    const response = await api.post('/users/change-password', data);
    return response;
  },

  // Upload avatar - BYPASS INTERCEPTOR FOR MULTIPART
  uploadAvatar: async (userId, formData) => {
    console.log('[userService] ========== UPLOAD AVATAR START ==========');
    console.log('[userService] User ID:', userId);
    console.log('[userService] FormData type:', formData.constructor.name);
    console.log('[userService] API_BASE_URL:', API_BASE_URL);
    
    try {
      // Get token directly
      const token = await SecureStore.getItemAsync('token');
      console.log('[userService] Token present:', !!token);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // BYPASS AXIOS INSTANCE - Use direct axios for multipart
      // This avoids any interceptor issues with FormData
      const url = `${API_BASE_URL}/users/${userId}/avatar`;
      console.log('[userService] Direct POST to:', url);
      
      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // DO NOT set Content-Type - let axios handle it for FormData
        },
        timeout: 60000, // 60 second timeout for file uploads
      });
      
      console.log('[userService] Upload response status:', response.status);
      console.log('[userService] Upload response data:', response.data);
      console.log('[userService] ========== UPLOAD AVATAR SUCCESS ==========');
      
      return response.data;
    } catch (error) {
      console.error('[userService] ========== UPLOAD AVATAR ERROR ==========');
      console.error('[userService] Error type:', error.constructor.name);
      console.error('[userService] Error message:', error.message);
      console.error('[userService] Error code:', error.code);
      
      if (error.response) {
        console.error('[userService] Response status:', error.response.status);
        console.error('[userService] Response data:', error.response.data);
      }
      
      throw error;
    }
  },

  // Update avatar URL (Android direct Cloudinary upload)
  updateAvatarUrl: async (userId, avatarUrl) => {
    console.log('[userService] ========== UPDATE AVATAR URL START ==========');
    console.log('[userService] User ID:', userId);
    console.log('[userService] Avatar URL:', avatarUrl);
    
    const response = await api.patch(`/users/${userId}/avatar-url`, {
      avatar: avatarUrl,
    });
    
    console.log('[userService] Update response:', response);
    console.log('[userService] ========== UPDATE AVATAR URL SUCCESS ==========');
    
    return response;
  },

  // Delete avatar
  deleteAvatar: async (userId) => {
    const response = await api.delete(`/users/${userId}/avatar`);
    return response;
  },

  // Get user statistics
  getUserStats: async (userId) => {
    const response = await api.get(`/users/${userId}/stats`);
    return response;
  },

  // Get user observations
  getUserObservations: async (userId, params = {}) => {
    const response = await api.get(`/users/${userId}/observations`, { params });
    return response;
  },

  // Get user badges
  getUserBadges: async (userId) => {
    const response = await api.get(`/users/${userId}/badges`);
    return response;
  },

  // Get user rewards
  getUserRewards: async (userId) => {
    const response = await api.get(`/users/${userId}/rewards`);
    return response;
  },

  // Get notification preferences
  getNotificationPreferences: async () => {
    const response = await api.get('/users/notifications');
    return response;
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    const response = await api.put('/users/notifications', preferences);
    return response;
  },
};

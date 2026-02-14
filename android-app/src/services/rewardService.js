import api from './api';

export const rewardService = {
  // Get user rewards
  getUserRewards: async (userId) => {
    const response = await api.get(`/rewards/user/${userId}`);
    return response;
  },

  // Get available rewards
  getAvailableRewards: async () => {
    const response = await api.get('/rewards');
    return response;
  },

  // Get all rewards (admin)
  getRewards: async () => {
    const response = await api.get('/rewards');
    return response;
  },

  // Get reward by ID
  getRewardById: async (id) => {
    const response = await api.get(`/rewards/${id}`);
    return response;
  },

  // Create reward (admin only)
  createReward: async (data) => {
    const response = await api.post('/rewards', data);
    return response;
  },

  // Update reward (admin only)
  updateReward: async (id, data) => {
    const response = await api.put(`/rewards/${id}`, data);
    return response;
  },

  // Delete reward (admin only)
  deleteReward: async (id) => {
    const response = await api.delete(`/rewards/${id}`);
    return response;
  },

  // Get user badges
  getUserBadges: async (userId) => {
    const response = await api.get(`/badges/user/${userId}`);
    return response;
  },

  // Get points history
  getPointsHistory: async (userId) => {
    const response = await api.get(`/rewards/user/${userId}/history`);
    return response;
  },

  // Claim reward
  claimReward: async (rewardId) => {
    const response = await api.post(`/rewards/${rewardId}/claim`);
    return response;
  },

  // Get pending rewards (admin only)
  getPendingRewards: async () => {
    const response = await api.get('/rewards/pending');
    return response;
  },

  // Approve reward (admin only)
  approveReward: async (userRewardId, notes = '') => {
    const response = await api.put(`/rewards/user-reward/${userRewardId}/approve`, { notes });
    return response;
  },

  // Reject reward (admin only)
  rejectReward: async (userRewardId, notes = '') => {
    const response = await api.put(`/rewards/user-reward/${userRewardId}/reject`, { notes });
    return response;
  },
};

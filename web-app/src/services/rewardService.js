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

  // Get all rewards (admin) - same as getAvailableRewards, uses GET /rewards
  getAllRewards: async () => {
    const response = await api.get('/rewards');
    return response;
  },

  // Create reward (admin)
  createReward: async (data) => {
    const response = await api.post('/rewards', data);
    return response;
  },

  // Update reward (admin)
  updateReward: async (id, data) => {
    const response = await api.put(`/rewards/${id}`, data);
    return response;
  },

  // Delete reward (admin)
  deleteReward: async (id) => {
    const response = await api.delete(`/rewards/${id}`);
    return response;
  },

  // Get pending rewards (admin)
  getPendingRewards: async () => {
    const response = await api.get('/rewards/pending');
    return response;
  },

  // Approve reward (admin)
  approveReward: async (userRewardId, notes = '') => {
    const response = await api.put(`/rewards/user-reward/${userRewardId}/approve`, { notes });
    return response;
  },

  // Reject reward (admin)
  rejectReward: async (userRewardId, notes = '') => {
    const response = await api.put(`/rewards/user-reward/${userRewardId}/reject`, { notes });
    return response;
  },
};
import api from './api';

export const leaderboardService = {
  // Get leaderboard
  getLeaderboard: async (filters = {}) => {
    const response = await api.get('/leaderboard', { params: filters });
    return response;
  },

  // Get user rank
  getUserRank: async (userId) => {
    const response = await api.get(`/leaderboard/user/${userId}/rank`);
    return response;
  },

  // Get department leaderboard
  getDepartmentLeaderboard: async (filters = {}) => {
    const response = await api.get('/leaderboard/departments', { params: filters });
    return response;
  },

  // Get top performers
  getTopPerformers: async (limit = 10) => {
    const response = await api.get('/leaderboard/top', { params: { limit } });
    return response;
  },
};

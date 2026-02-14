import api from './api';

export const leaderboardService = {
  // Get leaderboard
  getLeaderboard: async (filters = {}) => {
    const response = await api.get('/leaderboard', { params: filters });
    return response;
  },

  // Get department rankings
  getDepartmentRankings: async (timePeriod = 'weekly') => {
    const response = await api.get('/leaderboard/departments', { 
      params: { timePeriod } 
    });
    return response;
  },

  // Get ward rankings
  getWardRankings: async (timePeriod = 'weekly') => {
    const response = await api.get('/leaderboard/wards', { 
      params: { timePeriod } 
    });
    return response;
  },

  // Get user rank
  getUserRank: async (userId) => {
    const response = await api.get(`/leaderboard/user/${userId}/rank`);
    return response;
  },

  // Get top performers
  getTopPerformers: async (limit = 10, timePeriod = 'weekly') => {
    const response = await api.get('/leaderboard/top', { 
      params: { limit, timePeriod } 
    });
    return response;
  },
};
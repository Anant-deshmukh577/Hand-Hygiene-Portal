import api from './api';

export const healthService = {
  getHealth: async () => api.get('/health'),
};

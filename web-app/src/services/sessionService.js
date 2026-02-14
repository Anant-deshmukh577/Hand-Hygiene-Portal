import api from './api';

export const sessionService = {
  // Get all sessions
  getSessions: async (filters = {}) => {
    const response = await api.get('/sessions', { params: filters });
    return response;
  },

  // Get single session
  getSessionById: async (id) => {
    const response = await api.get(`/sessions/${id}`);
    return response;
  },

  // Create session
  createSession: async (data) => {
    const response = await api.post('/sessions', data);
    return response;
  },

  // Update session
  updateSession: async (id, data) => {
    const response = await api.put(`/sessions/${id}`, data);
    return response;
  },

  // Delete session
  deleteSession: async (id) => {
    const response = await api.delete(`/sessions/${id}`);
    return response;
  },

  // End session
  endSession: async (id) => {
    const response = await api.post(`/sessions/${id}/end`);
    return response;
  },

  // Get active sessions
  getActiveSessions: async () => {
    const response = await api.get('/sessions/active');
    return response;
  },
};
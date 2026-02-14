import api from './api';

export const observationService = {
  // Get all observations
  getObservations: async (filters = {}) => {
    const response = await api.get('/observations', { params: filters });
    return response;
  },

  // Get single observation
  getObservationById: async (id) => {
    const response = await api.get(`/observations/${id}`);
    return response;
  },

  // Create observation
  createObservation: async (data) => {
    const response = await api.post('/observations', data);
    return response;
  },

  // Update observation
  updateObservation: async (id, data) => {
    const response = await api.put(`/observations/${id}`, data);
    return response;
  },

  // Delete observation
  deleteObservation: async (id) => {
    const response = await api.delete(`/observations/${id}`);
    return response;
  },

  // Get observations by user
  getObservationsByUser: async (userId, filters = {}) => {
    const response = await api.get(`/observations/user/${userId}`, { params: filters });
    return response;
  },

  // Get observations by session
  getObservationsBySession: async (sessionId) => {
    const response = await api.get(`/observations/session/${sessionId}`);
    return response;
  },

  // Bulk create observations
  bulkCreateObservations: async (observations) => {
    const response = await api.post('/observations/bulk', { observations });
    return response;
  },
};

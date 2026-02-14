import api from './api';

export const wardService = {
  // Get all wards
  getWards: async () => {
    const response = await api.get('/wards');
    return response;
  },

  // Get ward by id
  getWardById: async (id) => {
    const response = await api.get(`/wards/${id}`);
    return response;
  },

  // Create ward (admin)
  createWard: async (data) => {
    const response = await api.post('/wards', data);
    return response;
  },

  // Update ward (admin)
  updateWard: async (id, data) => {
    const response = await api.put(`/wards/${id}`, data);
    return response;
  },

  // Delete ward (admin)
  deleteWard: async (id) => {
    const response = await api.delete(`/wards/${id}`);
    return response;
  },

  // Get departments
  getDepartments: async () => {
    const response = await api.get('/departments');
    return response;
  },
};
import api from './api';

export const reportService = {
  // Get dashboard stats
  getDashboardStats: async (filters = {}) => {
    const response = await api.get('/reports/dashboard', { params: filters });
    return response;
  },

  // Get compliance report
  getComplianceReport: async (filters = {}) => {
    const response = await api.get('/reports/compliance', { params: filters });
    return response;
  },

  // Get department report
  getDepartmentReport: async (department, filters = {}) => {
    const response = await api.get(`/reports/department/${department}`, { 
      params: filters 
    });
    return response;
  },

  // Get ward report
  getWardReport: async (ward, filters = {}) => {
    const response = await api.get(`/reports/ward/${ward}`, { 
      params: filters 
    });
    return response;
  },

  // Get user report
  getUserReport: async (userId, filters = {}) => {
    const response = await api.get(`/reports/user/${userId}`, { 
      params: filters 
    });
    return response;
  },

  // Get trend report
  getTrendReport: async (filters = {}) => {
    const response = await api.get('/reports/trends', { params: filters });
    return response;
  },

  // Export report
  exportReport: async (type, filters = {}) => {
    const response = await api.get(`/reports/export/${type}`, { 
      params: filters,
      responseType: 'blob'
    });
    return response;
  },

  // Get WHO moments distribution
  getWHOMomentsDistribution: async (filters = {}) => {
    const response = await api.get('/reports/who-moments', { params: filters });
    return response;
  },
};
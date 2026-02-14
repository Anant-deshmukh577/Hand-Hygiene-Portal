import api from './api';

export const reportService = {
  // Get dashboard stats
  getDashboardStats: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.department) params.append('department', filters.department);
    if (filters.ward) params.append('ward', filters.ward);

    const response = await api.get(`/reports/dashboard?${params.toString()}`);
    return response;
  },

  // Get compliance report (WHO moments breakdown)
  getComplianceReport: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.department) params.append('department', filters.department);
    if (filters.ward) params.append('ward', filters.ward);

    const response = await api.get(`/reports/compliance?${params.toString()}`);
    return response;
  },

  // Get trend report
  getTrendReport: async (days = 7) => {
    const response = await api.get(`/reports/trends?days=${days}`);
    return response;
  },

  // Export report
  exportReport: async (format, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.department) params.append('department', filters.department);
    if (filters.ward) params.append('ward', filters.ward);
    if (filters.reportType) params.append('reportType', filters.reportType);

    const response = await api.get(`/reports/export/${format}?${params.toString()}`);
    return response;
  },
};

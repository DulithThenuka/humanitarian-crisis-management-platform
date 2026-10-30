import apiClient from './apiClient';

export const analyticsService = {
  getOperationalKpis: async () => {
    return await apiClient.get('/analytics/operational-kpis');
  }
};

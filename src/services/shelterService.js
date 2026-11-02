import apiClient from './apiClient';

export const shelterService = {
  getAll: async () => {
    return await apiClient.get('/shelters');
  },
  getNearby: async (lat, lon, radius = 25) => {
    return await apiClient.get('/shelters/nearby', { params: { lat, lon, radius } });
  },
  allocate: async (allocationData) => {
    return await apiClient.post('/shelters/allocate', allocationData);
  }
};

import apiClient from './apiClient';

export const resourceService = {
  getInventory: async () => {
    return await apiClient.get('/resources');
  },
  getLowStock: async () => {
    return await apiClient.get('/resources/low-stock');
  },
  dispatch: async (dispatchData) => {
    return await apiClient.post('/resources/dispatch', dispatchData);
  }
};

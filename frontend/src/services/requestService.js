import apiClient from './apiClient';

export const requestService = {
  getAll: async (status, urgency) => {
    const params = {};
    if (status !== undefined) params.status = status;
    if (urgency !== undefined) params.urgency = urgency;
    return await apiClient.get('/assistancerequests', { params });
  },
  getById: async (id) => {
    return await apiClient.get(`/assistancerequests/${id}`);
  },
  create: async (data) => {
    return await apiClient.post('/assistancerequests', data);
  },
  updateStatus: async (id, statusData) => {
    return await apiClient.put(`/assistancerequests/${id}/status`, statusData);
  }
};

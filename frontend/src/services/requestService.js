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
  search: async (query) => {
    try {
      const res = await apiClient.get('/assistancerequests');
      const list = res?.data || (Array.isArray(res) ? res : []);
      const found = list.find(r => 
        r.id?.toString().toLowerCase().includes(query.toLowerCase()) ||
        r.category?.toLowerCase().includes(query.toLowerCase()) ||
        r.description?.toLowerCase().includes(query.toLowerCase())
      );
      return { succeeded: !!found, data: found };
    } catch (err) {
      return { succeeded: false, error: err };
    }
  },
  create: async (data) => {
    return await apiClient.post('/assistancerequests', data);
  },
  updateStatus: async (id, statusData) => {
    return await apiClient.put(`/assistancerequests/${id}/status`, statusData);
  }
};

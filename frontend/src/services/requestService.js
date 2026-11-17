import apiClient from './apiClient';

const unwrap = (res) => (res && res.data !== undefined ? res.data : res);

export const requestService = {
  getAll: async (status, urgency) => {
    const params = {};
    if (status !== undefined) params.status = status;
    if (urgency !== undefined) params.urgency = urgency;
    const res = await apiClient.get('/assistancerequests', { params });
    return unwrap(res);
  },
  getById: async (id) => {
    const res = await apiClient.get(`/assistancerequests/${id}`);
    return unwrap(res);
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
    const res = await apiClient.post('/assistancerequests', data);
    return unwrap(res);
  },
  updateStatus: async (id, statusData) => {
    const res = await apiClient.put(`/assistancerequests/${id}/status`, statusData);
    return unwrap(res);
  },
  verify: async (id, verifyData) => {
    const res = await apiClient.post(`/assistancerequests/${id}/verify`, verifyData);
    return unwrap(res);
  },
  escalate: async (id, escalateData) => {
    const res = await apiClient.post(`/assistancerequests/${id}/escalate`, escalateData);
    return unwrap(res);
  },
  addNote: async (id, noteData) => {
    const res = await apiClient.post(`/assistancerequests/${id}/notes`, noteData);
    return unwrap(res);
  }
};

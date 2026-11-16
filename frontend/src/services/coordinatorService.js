import apiClient from './apiClient';

const unwrap = (res) => {
  if (!res) return null;
  if (res.data !== undefined && res.data !== null) {
    if (res.data.data !== undefined && res.data.data !== null && typeof res.data.data === 'object') {
      return res.data.data;
    }
    return res.data;
  }
  return res;
};

export const coordinatorService = {
  getOverview: async () => {
    const res = await apiClient.get('/coordinator/overview');
    return unwrap(res);
  },
  getDecisionHistory: async () => {
    const res = await apiClient.get('/coordinator/history');
    return unwrap(res);
  },
  verifyRequest: async (id, data) => {
    const res = await apiClient.post(`/coordinator/requests/${id}/verify`, data);
    return unwrap(res);
  },
  escalateRequest: async (id, data) => {
    const res = await apiClient.post(`/coordinator/requests/${id}/escalate`, data);
    return unwrap(res);
  },
  addNote: async (id, data) => {
    const res = await apiClient.post(`/coordinator/requests/${id}/notes`, data);
    return unwrap(res);
  },
  requestInfo: async (id, data) => {
    const res = await apiClient.post(`/coordinator/requests/${id}/request-info`, data);
    return unwrap(res);
  },
  getCrisisEvents: async (activeOnly = false) => {
    const res = await apiClient.get('/crisisevents', { params: { activeOnly } });
    return unwrap(res);
  },
  getCrisisEventById: async (id) => {
    const res = await apiClient.get(`/crisisevents/${id}`);
    return unwrap(res);
  },
  createCrisisEvent: async (data) => {
    const res = await apiClient.post('/crisisevents', data);
    return unwrap(res);
  },
  getAlerts: async (tab = null) => {
    const params = tab && tab !== 'all' ? { tab } : {};
    const res = await apiClient.get('/alerts', { params });
    return unwrap(res);
  },
  getAlertById: async (id) => {
    const res = await apiClient.get(`/alerts/${id}`);
    return unwrap(res);
  },
  createAlert: async (data) => {
    const res = await apiClient.post('/alerts', data);
    return unwrap(res);
  },
  updateAlert: async (id, data) => {
    const res = await apiClient.put(`/alerts/${id}`, data);
    return unwrap(res);
  },
  resolveAlert: async (id, data = null) => {
    const res = await apiClient.post(`/alerts/${id}/resolve`, data || {});
    return unwrap(res);
  },
  publishAlert: async (id) => {
    const res = await apiClient.post(`/alerts/${id}/publish`);
    return unwrap(res);
  },
  getResourceCoordination: async () => {
    const res = await apiClient.get('/coordinator/resources');
    return unwrap(res);
  },
  submitResourceAllocationRequest: async (data) => {
    const res = await apiClient.post('/coordinator/resources/allocation-requests', data);
    return unwrap(res);
  },
  getShelterVolunteerCoordination: async () => {
    const res = await apiClient.get('/coordinator/shelter-volunteer');
    return unwrap(res);
  },
  submitShelterPlacementRequest: async (data) => {
    const res = await apiClient.post('/coordinator/shelter-requests', data);
    return unwrap(res);
  },
  submitVolunteerAssignmentRequest: async (data) => {
    const res = await apiClient.post('/coordinator/volunteer-requests', data);
    return unwrap(res);
  }
};

export default coordinatorService;

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
  getCases: async ({ status, category, priority, search } = {}) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    if (priority) params.append('priority', priority);
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get(`/coordinator/cases${query}`);
    return unwrap(res);
  },
  getCaseById: async (idOrReference) => {
    const res = await apiClient.get(`/coordinator/cases/${encodeURIComponent(idOrReference)}`);
    return unwrap(res);
  },
  verifyCase: async (idOrReference, { reason, confirmedCheck = true, assignedTeam, notes }) => {
    const res = await apiClient.post(`/coordinator/cases/${encodeURIComponent(idOrReference)}/verify`, {
      reason,
      confirmedCheck,
      assignedTeam,
      notes
    });
    return unwrap(res);
  },
  addCaseNote: async (idOrReference, text) => {
    const res = await apiClient.post(`/coordinator/cases/${encodeURIComponent(idOrReference)}/notes`, {
      text
    });
    return unwrap(res);
  },
  reviewAIDecision: async (idOrReference, { action = 'Approve', overriddenPriority, reason, decisionAuditId }) => {
    const res = await apiClient.post(`/coordinator/cases/${encodeURIComponent(idOrReference)}/ai-review`, {
      action,
      overriddenPriority: overriddenPriority || 0,
      reason: reason || '',
      decisionAuditId: decisionAuditId || '00000000-0000-0000-0000-000000000000'
    });
    return unwrap(res);
  },
  getDecisionHistory: async (take = 20) => {
    const res = await apiClient.get(`/coordinator/history?take=${take}`);
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
  getIncidents: async () => {
    const res = await apiClient.get('/coordinator/incidents');
    return unwrap(res);
  },
  createIncident: async (data) => {
    const res = await apiClient.post('/coordinator/incidents', data);
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
  },
  getAnalytics: async (params = {}) => {
    const res = await apiClient.get('/coordinator/analytics', { params });
    return unwrap(res);
  }
};

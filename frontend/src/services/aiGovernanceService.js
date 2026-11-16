import apiClient from './apiClient';

export const aiGovernanceService = {
  getStatus: async () => {
    return await apiClient.get('/aireview/status');
  },

  getOverview: async () => {
    return await apiClient.get('/aireview/overview');
  },

  getQueue: async (params = {}) => {
    return await apiClient.get('/aireview/queue', { params });
  },

  getCase: async (caseId) => {
    return await apiClient.get(`/aireview/case/${encodeURIComponent(caseId)}`);
  },

  recordDecision: async (decisionData) => {
    return await apiClient.post('/aireview/decision', decisionData);
  },

  executeService: async (serviceId, payload) => {
    return await apiClient.post(`/aireview/services/${encodeURIComponent(serviceId)}/execute`, payload);
  },

  getTrace: async (caseId) => {
    return await apiClient.get(`/aireview/trace/${encodeURIComponent(caseId)}`);
  },

  addNote: async (caseId, noteText) => {
    return await apiClient.post(`/aireview/trace/${encodeURIComponent(caseId)}/notes`, { noteText });
  },

  // Existing methods for backward compatibility
  overrideDecision: async (overrideData) => {
    return await apiClient.post('/aireview/override', overrideData);
  },

  approveDecision: async (approveData) => {
    return await apiClient.post('/aireview/approve', approveData);
  }
};

export default aiGovernanceService;

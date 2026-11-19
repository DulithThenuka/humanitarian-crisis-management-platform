import apiClient from './apiClient';

export const partnerService = {
  getSummary: async () => {
    return await apiClient.get('/partners/summary');
  },
  getPartners: async (search = '', status = '') => {
    const params = {};
    if (search) params.search = search;
    if (status && status !== 'ALL') params.status = status;
    return await apiClient.get('/partners', { params });
  },
  getPartnerById: async (id) => {
    return await apiClient.get(`/partners/${id}`);
  },
  createPartner: async (payload) => {
    return await apiClient.post('/partners', payload);
  },
  updatePartner: async (id, payload) => {
    return await apiClient.put(`/partners/${id}`, payload);
  },
  updatePartnerStatus: async (id, payload) => {
    return await apiClient.patch(`/partners/${id}/status`, payload);
  },
  getCommitments: async (partnerId = null) => {
    const params = partnerId ? { partnerId } : {};
    return await apiClient.get('/partners/commitments', { params });
  },
  logCommitment: async (payload) => {
    return await apiClient.post('/partners/commitments', payload);
  },
  updateCommitment: async (commitmentId, payload) => {
    return await apiClient.put(`/partners/commitments/${commitmentId}`, payload);
  },
  updateCommitmentStatus: async (commitmentId, status) => {
    return await apiClient.patch(`/partners/commitments/${commitmentId}/status`, { status });
  },
  getSectorZones: async () => {
    return await apiClient.get('/partners/zones');
  },
  assignPartnerToZone: async (payload) => {
    return await apiClient.post('/partners/zones/assign', payload);
  }
};

export default partnerService;


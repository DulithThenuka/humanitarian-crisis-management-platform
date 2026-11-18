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
  updateCommitmentStatus: async (commitmentId, status) => {
    return await apiClient.patch(`/partners/commitments/${commitmentId}/status`, { status });
  },
  getSectorZones: async () => {
    return await apiClient.get('/partners/zones');
  },
  assignPartnerToZone: async (payload) => {
    return await apiClient.post('/partners/zones/assign', payload);
  },

  // Partner Organisation Officer Operations
  getOfficerDashboard: async (organisation = '') => {
    const params = organisation ? { organisation } : {};
    return await apiClient.get('/partner-officer/officer/dashboard', { params });
  },
  getOfficerRecords: async (status = '', search = '', operationalArea = '') => {
    const params = {};
    if (status && status !== 'all') params.status = status;
    if (search) params.search = search;
    if (operationalArea && operationalArea !== 'all') params.operationalArea = operationalArea;
    return await apiClient.get('/partner-officer/officer/records', { params });
  },
  getOfficerRecordById: async (id) => {
    return await apiClient.get(`/partner-officer/officer/records/${id}`);
  },
  createOfficerRecord: async (payload) => {
    return await apiClient.post('/partner-officer/officer/records', payload);
  },
  processRecordAction: async (id, payload) => {
    return await apiClient.post(`/partner-officer/officer/records/${id}/action`, payload);
  },
  getTimeline: async () => {
    return await apiClient.get('/partner-officer/officer/timeline');
  },
  addTimelineEntry: async (payload) => {
    return await apiClient.post('/partner-officer/officer/timeline', payload);
  }
};

export default partnerService;


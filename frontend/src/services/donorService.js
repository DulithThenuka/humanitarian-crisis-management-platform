import apiClient from './apiClient';

export const donorService = {
  // Public & Telemetry
  getSummary: async () => {
    return await apiClient.get('/donor/summary');
  },
  getReliefPackages: async () => {
    return await apiClient.get('/donor/packages');
  },
  getDonations: async (params = {}) => {
    return await apiClient.get('/donor', { params });
  },
  getDonationById: async (id) => {
    return await apiClient.get(`/donor/${id}`);
  },
  createDonation: async (payload) => {
    return await apiClient.post('/donor', payload);
  },
  updateDonationStatus: async (id, status) => {
    return await apiClient.patch(`/donor/${id}/status`, { status });
  },
  getReceipt: async (id) => {
    return await apiClient.get(`/donor/${id}/receipt`);
  },

  // Funding Officer Portal Operations
  getDashboard: async () => {
    return await apiClient.get('/donor/dashboard');
  },
  getDonorProfiles: async (type = '', status = '', search = '') => {
    const params = {};
    if (type && type !== 'all') params.type = type;
    if (status && status !== 'all') params.status = status;
    if (search) params.search = search;
    return await apiClient.get('/donor/donors', { params });
  },
  updateDonorVerification: async (donorId, payload) => {
    return await apiClient.post(`/donor/donors/${encodeURIComponent(donorId)}/verify`, payload);
  },
  getDonorRecords: async (type = '', status = '', search = '') => {
    const params = {};
    if (type && type !== 'all') params.type = type;
    if (status && status !== 'all') params.status = status;
    if (search) params.search = search;
    return await apiClient.get('/donor/records', { params });
  },
  getDonorRecordById: async (id) => {
    return await apiClient.get(`/donor/records/${id}`);
  },
  createRecord: async (payload) => {
    return await apiClient.post('/donor/records', payload);
  },
  processDecision: async (id, payload) => {
    return await apiClient.post(`/donor/records/${id}/decision`, payload);
  },
  getCampaigns: async () => {
    return await apiClient.get('/donor/campaigns');
  },
  createCampaign: async (payload) => {
    return await apiClient.post('/donor/campaigns', payload);
  },
  updateCampaignStatus: async (id, status) => {
    return await apiClient.patch(`/donor/campaigns/${id}/status`, { status });
  },
  getAllocationOverview: async () => {
    return await apiClient.get('/donor/allocations/overview');
  },
  getAllocations: async () => {
    return await apiClient.get('/donor/allocations');
  },
  createAllocation: async (payload) => {
    return await apiClient.post('/donor/allocations', payload);
  },
  approveAllocation: async (id, payload) => {
    return await apiClient.post(`/donor/allocations/${id}/approve`, payload);
  },
  getSuspiciousFlags: async () => {
    return await apiClient.get('/donor/suspicious-flags');
  },
  resolveFlag: async (id, payload) => {
    return await apiClient.post(`/donor/suspicious-flags/${id}/resolve`, payload);
  },
  getTransparencyReport: async (params = {}) => {
    return await apiClient.get('/donor/reports', { params });
  }
};

export default donorService;

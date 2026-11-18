import apiClient from './apiClient';

export const volunteerService = {
  // -------------------------------------------------------------
  // Volunteer Directory & Roster
  // -------------------------------------------------------------
  getAll: async (params = {}) => {
    return await apiClient.get('/volunteers', { params });
  },

  getDirectory: async (search = '', status = '', serviceArea = '') => {
    const params = {};
    if (search) params.search = search;
    if (status && status !== 'all') params.status = status;
    if (serviceArea && serviceArea !== 'all') params.serviceArea = serviceArea;
    return await apiClient.get('/volunteers', { params });
  },

  createRecord: async (volunteerData) => {
    return await apiClient.post('/volunteers/records', volunteerData);
  },

  // -------------------------------------------------------------
  // Volunteer Self-Service Portal
  // -------------------------------------------------------------
  getDashboard: async () => {
    return await apiClient.get('/volunteers/dashboard');
  },

  getProfile: async () => {
    return await apiClient.get('/volunteers/profile');
  },

  updateProfile: async (profileData) => {
    return await apiClient.put('/volunteers/profile', profileData);
  },

  getMyAssignments: async () => {
    return await apiClient.get('/volunteers/assignments');
  },

  updateAssignmentStatus: async (assignmentId, action, notes = '') => {
    return await apiClient.post(`/volunteers/assignments/${assignmentId}/status`, { action, notes });
  },

  getOpportunities: async () => {
    return await apiClient.get('/volunteers/opportunities');
  },

  acceptOpportunity: async (opportunityId) => {
    return await apiClient.post(`/volunteers/opportunities/${opportunityId}/accept`);
  },

  // -------------------------------------------------------------
  // Volunteer Coordinator Portal
  // -------------------------------------------------------------
  getCoordinatorDashboard: async () => {
    return await apiClient.get('/volunteers/coordinator/dashboard');
  },

  assignShift: async (shiftData) => {
    return await apiClient.post('/volunteers/shifts/assign', shiftData);
  },

  getAIMatchingRecommendations: async () => {
    return await apiClient.get('/volunteers/matching');
  },

  // Legacy task assign
  assignTask: async (assignmentData) => {
    return await apiClient.post('/volunteers/assign', assignmentData);
  }
};

export default volunteerService;

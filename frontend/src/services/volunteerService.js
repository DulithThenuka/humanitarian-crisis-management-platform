import apiClient from './apiClient';

export const volunteerService = {
  // 1. Dashboard Overview
  getDashboard: async () => {
    return await apiClient.get('/volunteers/dashboard');
  },

  // 2. Volunteer Directory & Profiles
  getMyProfile: async () => {
    return await apiClient.get('/volunteers/me');
  },
  getProfile: async () => {
    return await apiClient.get('/volunteers/profile');
  },
  updateProfile: async (profileData) => {
    return await apiClient.put('/volunteers/profile', profileData);
  },
  getAll: async (params = {}) => {
    return await apiClient.get('/volunteers', { params });
  },
  getAllVolunteers: async (params = {}) => {
    return await apiClient.get('/volunteers', { params });
  },
  getDirectory: async (search = '', status = '', serviceArea = '') => {
    const params = {};
    if (search) params.search = search;
    if (status && status !== 'all') params.status = status;
    if (serviceArea && serviceArea !== 'all') params.serviceArea = serviceArea;
    return await apiClient.get('/volunteers', { params });
  },
  getVolunteerById: async (id) => {
    return await apiClient.get(`/volunteers/${id}`);
  },
  createVolunteer: async (data) => {
    return await apiClient.post('/volunteers', data);
  },
  createRecord: async (volunteerData) => {
    return await apiClient.post('/volunteers/records', volunteerData);
  },
  updateVolunteer: async (id, data) => {
    return await apiClient.put(`/volunteers/${id}`, data);
  },
  deleteVolunteer: async (id) => {
    return await apiClient.delete(`/volunteers/${id}`);
  },
  verifyVolunteer: async (id, data = {}) => {
    return await apiClient.post(`/volunteers/${id}/verify`, data);
  },
  requestClarification: async (id, data = {}) => {
    return await apiClient.post(`/volunteers/${id}/clarify`, data);
  },
  escalateVolunteer: async (id, data = {}) => {
    return await apiClient.post(`/volunteers/${id}/escalate`, data);
  },

  // 3. Scheduling & Assignments
  getAssignments: async (params = {}) => {
    return await apiClient.get('/volunteers/assignments', { params });
  },
  getMyAssignments: async () => {
    return await apiClient.get('/volunteers/assignments');
  },
  assignShift: async (data) => {
    return await apiClient.post('/volunteers/assignments', data);
  },
  assignTask: async (assignmentData) => {
    return await apiClient.post('/volunteers/assign', assignmentData);
  },
  acceptAssignment: async (id) => {
    return await apiClient.post(`/volunteers/assignments/${id}/accept`);
  },
  updateAssignmentStatus: async (assignmentId, action, notes = '') => {
    return await apiClient.post(`/volunteers/assignments/${assignmentId}/status`, { action, notes });
  },
  completeAssignment: async (id, data = {}) => {
    return await apiClient.post(`/volunteers/assignments/${id}/complete`, data);
  },
  releaseAssignment: async (id, data = {}) => {
    return await apiClient.post(`/volunteers/assignments/${id}/release`, data);
  },

  // 4. Opportunities
  getOpportunities: async () => {
    return await apiClient.get('/volunteers/opportunities');
  },
  acceptOpportunity: async (opportunityId) => {
    return await apiClient.post(`/volunteers/opportunities/${opportunityId}/accept`);
  },

  // 5. Matching & Decisions
  getMatchingRecommendation: async () => {
    return await apiClient.get('/volunteers/matching');
  },
  getAIMatchingRecommendations: async () => {
    return await apiClient.get('/volunteers/matching');
  },
  recordMatchingDecision: async (data) => {
    return await apiClient.post('/volunteers/matching/decide', data);
  },
  getMatchingHistory: async () => {
    return await apiClient.get('/volunteers/matching/history');
  },

  // 6. Activity & Safety Scoped Updates
  getActivityTimeline: async () => {
    return await apiClient.get('/volunteers/activity');
  },
  recordScopedUpdate: async (data) => {
    return await apiClient.post('/volunteers/activity', data);
  },

  // 7. Coordinator Dashboard & Reports
  getCoordinatorDashboard: async () => {
    return await apiClient.get('/volunteers/coordinator/dashboard');
  },
  getReports: async (params = {}) => {
    return await apiClient.get('/volunteers/reports', { params });
  },
  exportReport: async (data = {}) => {
    return await apiClient.post('/volunteers/reports/export', data);
  }
};

export default volunteerService;

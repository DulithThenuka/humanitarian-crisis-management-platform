import apiClient from './apiClient';

export const volunteerService = {
  // 1. Dashboard Overview
  getDashboard: async () => {
    return await apiClient.get('/volunteers/dashboard');
  },

  // 2. Volunteer Directory
  getAll: async (params = {}) => {
    return await apiClient.get('/volunteers', { params });
  },
  getAllVolunteers: async (params = {}) => {
    return await apiClient.get('/volunteers', { params });
  },
  getVolunteerById: async (id) => {
    return await apiClient.get(`/volunteers/${id}`);
  },
  createVolunteer: async (data) => {
    return await apiClient.post('/volunteers', data);
  },
  updateVolunteer: async (id, data) => {
    return await apiClient.put(`/volunteers/${id}`, data);
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

  // 3. Scheduling & Assignment
  getAssignments: async (params = {}) => {
    return await apiClient.get('/volunteers/assignments', { params });
  },
  assignShift: async (data) => {
    return await apiClient.post('/volunteers/assignments', data);
  },
  assignTask: async (assignmentData) => {
    return await apiClient.post('/volunteers/assign', assignmentData);
  },
  completeAssignment: async (id, data = {}) => {
    return await apiClient.post(`/volunteers/assignments/${id}/complete`, data);
  },
  releaseAssignment: async (id, data = {}) => {
    return await apiClient.post(`/volunteers/assignments/${id}/release`, data);
  },

  // 4. Matching & Decision Audit
  getMatchingRecommendation: async () => {
    return await apiClient.get('/volunteers/matching');
  },
  recordMatchingDecision: async (data) => {
    return await apiClient.post('/volunteers/matching/decide', data);
  },
  getMatchingHistory: async () => {
    return await apiClient.get('/volunteers/matching/history');
  },

  // 5. Activity & Safety Scoped Updates
  getActivityTimeline: async () => {
    return await apiClient.get('/volunteers/activity');
  },
  recordScopedUpdate: async (data) => {
    return await apiClient.post('/volunteers/activity', data);
  },

  // 6. Reports & Analytics
  getReports: async (params = {}) => {
    return await apiClient.get('/volunteers/reports', { params });
  },
  exportReport: async (data = {}) => {
    return await apiClient.post('/volunteers/reports/export', data);
  }
};

export default volunteerService;

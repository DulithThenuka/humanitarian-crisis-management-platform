import apiClient from './apiClient';

export const adminService = {
  /**
   * 1. Core Dashboard Telemetry & System Statistics
   */
  getDashboardStats: async () => {
    return await apiClient.get('/admin/dashboard-stats');
  },

  /**
   * 2. User & RBAC Management
   */
  getUsers: async ({ role, isActive, search } = {}) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (typeof isActive === 'boolean') params.append('isActive', isActive.toString());
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiClient.get(`/admin/users${query}`);
  },

  getUserById: async (id) => {
    return await apiClient.get(`/admin/users/${id}`);
  },

  createUser: async (userData) => {
    return await apiClient.post('/admin/users', userData);
  },

  updateUser: async (id, userData) => {
    return await apiClient.put(`/admin/users/${id}`, userData);
  },

  updateUserStatus: async (id, isActive) => {
    return await apiClient.put(`/admin/users/${id}/status`, { isActive });
  },

  updateUserRole: async (id, role) => {
    return await apiClient.put(`/admin/users/${id}/role`, { role });
  },

  resetPassword: async (id, newPassword) => {
    return await apiClient.post(`/admin/users/${id}/reset-password`, { newPassword });
  },

  deleteUser: async (id) => {
    return await apiClient.delete(`/admin/users/${id}`);
  },

  /**
   * 3. Security & Immutable Audit Logs
   */
  getAuditLogs: async (take = 50) => {
    return await apiClient.get(`/admin/audit-logs?take=${take}`);
  },

  /**
   * 4. Platform Settings
   */
  getSettings: async () => {
    return await apiClient.get('/admin/settings');
  },

  updateSettings: async (settingsData) => {
    return await apiClient.put('/admin/settings', settingsData);
  },

  /**
   * 5. Server Health & Team Credits
   */
  getSystemHealth: async () => {
    return await apiClient.get('/admin/system-health');
  },

  getProjectTeam: async () => {
    return await apiClient.get('/admin/team');
  },

  /**
   * 6. Financial Grants & Donations Management
   */
  getDonations: async ({ type, status, search } = {}) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiClient.get(`/admin/donations${query}`);
  },

  getDonationsSummary: async () => {
    return await apiClient.get('/admin/donations/summary');
  },

  createDonation: async (donationData) => {
    return await apiClient.post('/admin/donations', donationData);
  },

  verifyDonation: async (id, verifiedBy) => {
    return await apiClient.put(`/admin/donations/${id}/verify`, { verifiedBy });
  },

  deleteDonation: async (id) => {
    return await apiClient.delete(`/admin/donations/${id}`);
  },

  /**
   * 7. Emergency Broadcasts & Multi-Channel Alerts
   */
  getBroadcasts: async ({ activeOnly, severity } = {}) => {
    const params = new URLSearchParams();
    if (typeof activeOnly === 'boolean') params.append('activeOnly', activeOnly.toString());
    if (severity) params.append('severity', severity);

    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiClient.get(`/admin/broadcasts${query}`);
  },

  getActiveBroadcasts: async () => {
    return await apiClient.get('/admin/broadcasts/active');
  },

  createBroadcast: async (broadcastData) => {
    return await apiClient.post('/admin/broadcasts', broadcastData);
  },

  archiveBroadcast: async (id) => {
    return await apiClient.put(`/admin/broadcasts/${id}/archive`);
  },

  /**
   * 8. Situation Reports (SITREP)
   */
  getSituationReports: async (district) => {
    const query = district ? `?district=${encodeURIComponent(district)}` : '';
    return await apiClient.get(`/admin/reports${query}`);
  },

  generateSituationReport: async (reportData) => {
    return await apiClient.post('/admin/reports/generate', reportData);
  },

  /**
   * 9. AI Governance & Automated Triage Calibration
   */
  getAiGovernanceStats: async () => {
    return await apiClient.get('/admin/ai-governance');
  },

  calibrateAiModel: async (calibrationData) => {
    return await apiClient.post('/admin/ai-governance/calibrate', calibrationData);
  },

  /**
   * 10. System Maintenance & Integrity Diagnostics
   */
  runDiagnostics: async () => {
    return await apiClient.get('/admin/maintenance/diagnostics');
  },

  reseedDemoData: async () => {
    return await apiClient.post('/admin/maintenance/reseed');
  }
};

export default adminService;

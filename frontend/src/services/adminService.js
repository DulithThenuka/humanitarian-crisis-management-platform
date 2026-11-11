import apiClient from './apiClient';

export const adminService = {
  /**
   * Fetches system-wide operational metrics, user demographics, crisis totals, and server health.
   */
  getDashboardStats: async () => {
    return await apiClient.get('/admin/dashboard-stats');
  },

  /**
   * Searches and filters system users by role, active status, and query term.
   */
  getUsers: async ({ role, isActive, search } = {}) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (typeof isActive === 'boolean') params.append('isActive', isActive.toString());
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiClient.get(`/admin/users${query}`);
  },

  /**
   * Retrieves a specific user profile by unique identifier.
   */
  getUserById: async (id) => {
    return await apiClient.get(`/admin/users/${id}`);
  },

  /**
   * Creates a new user with administrative authority and credentials.
   */
  createUser: async (userData) => {
    return await apiClient.post('/admin/users', userData);
  },

  /**
   * Updates an existing user's profile details.
   */
  updateUser: async (id, userData) => {
    return await apiClient.put(`/admin/users/${id}`, userData);
  },

  /**
   * Toggles a user's account activation status (lock / unlock).
   */
  updateUserStatus: async (id, isActive) => {
    return await apiClient.put(`/admin/users/${id}/status`, { isActive });
  },

  /**
   * Updates a user's platform security role.
   */
  updateUserRole: async (id, role) => {
    return await apiClient.put(`/admin/users/${id}/role`, { role });
  },

  /**
   * Resets a user's password with a secure new hash.
   */
  resetPassword: async (id, newPassword) => {
    return await apiClient.post(`/admin/users/${id}/reset-password`, { newPassword });
  },

  /**
   * Deletes a user account from the system.
   */
  deleteUser: async (id) => {
    return await apiClient.delete(`/admin/users/${id}`);
  },

  /**
   * Retrieves cryptographically verifiable AI decision logs and human oversight audit entries.
   */
  getAuditLogs: async (take = 50) => {
    return await apiClient.get(`/admin/audit-logs?take=${take}`);
  }
};

export default adminService;


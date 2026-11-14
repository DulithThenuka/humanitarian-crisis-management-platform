import apiClient from './apiClient';

export const coordinatorService = {
  /**
   * Fetches high-level coordinator metrics, operational summaries, priority cases, and active alerts.
   */
  getOverview: async () => {
    return await apiClient.get('/coordinator/overview');
  },

  /**
   * Searches and filters assistance requests for coordinator review.
   */
  getCases: async ({ status, category, priority, search } = {}) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    if (priority) params.append('priority', priority);
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiClient.get(`/coordinator/cases${query}`);
  },

  /**
   * Retrieves full details, checklist items, and internal notes for a case.
   */
  getCaseById: async (idOrReference) => {
    return await apiClient.get(`/coordinator/cases/${encodeURIComponent(idOrReference)}`);
  },

  /**
   * Verifies a citizen request with field reason notes.
   */
  verifyCase: async (idOrReference, { reason, confirmedCheck = true, assignedTeam, notes }) => {
    return await apiClient.post(`/coordinator/cases/${encodeURIComponent(idOrReference)}/verify`, {
      reason,
      confirmedCheck,
      assignedTeam,
      notes
    });
  },

  /**
   * Appends an internal operational note to a case record.
   */
  addCaseNote: async (idOrReference, text) => {
    return await apiClient.post(`/coordinator/cases/${encodeURIComponent(idOrReference)}/notes`, {
      text
    });
  },

  /**
   * Reviews an AI triage decision (Approve or Override) with human reasoning audit.
   */
  reviewAIDecision: async (idOrReference, { action = 'Approve', overriddenPriority, reason, decisionAuditId }) => {
    return await apiClient.post(`/coordinator/cases/${encodeURIComponent(idOrReference)}/ai-review`, {
      action,
      overriddenPriority: overriddenPriority || 0,
      reason: reason || '',
      decisionAuditId: decisionAuditId || '00000000-0000-0000-0000-000000000000'
    });
  },

  /**
   * Retrieves high-priority emergency broadcast alerts.
   */
  getAlerts: async () => {
    return await apiClient.get('/coordinator/alerts');
  },

  /**
   * Issues and broadcasts an emergency alert to responders.
   */
  createAlert: async ({ title, severity = 'Critical', area = 'Western Province', instructions }) => {
    return await apiClient.post('/coordinator/alerts', {
      title,
      severity,
      area,
      instructions
    });
  },

  /**
   * Retrieves active crisis incidents in the humanitarian operation zone.
   */
  getIncidents: async () => {
    return await apiClient.get('/coordinator/incidents');
  },

  /**
   * Declares and registers a new crisis incident.
   */
  createIncident: async ({ title, severity = 'High', area = 'Western Province Sector', leadTeam = 'National Relief Unit' }) => {
    return await apiClient.post('/coordinator/incidents', {
      title,
      severity,
      area,
      leadTeam
    });
  },

  /**
   * Retrieves human-in-the-loop and AI decision audit history.
   */
  getDecisionHistory: async (take = 20) => {
    return await apiClient.get(`/coordinator/history?take=${take}`);
  }
};

export default coordinatorService;

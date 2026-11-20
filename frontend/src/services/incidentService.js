import apiClient from './apiClient';

export const normalizeIncidentForUI = (dto) => {
  if (!dto) return null;
  const priority = dto.priority || 'Medium';
  const status = dto.status || 'Open';
  const verification = dto.verification || 'Awaiting review';

  return {
    id: dto.caseNumber || dto.id,
    backendId: dto.id,
    caseNumber: dto.caseNumber || dto.id,
    title: dto.title || dto.category || 'Incident Case',
    category: dto.category || 'Emergency Shelter',
    operationalArea: dto.operationalArea || 'Kelani East - Zone 03',
    priority,
    priorityType: dto.priorityType || priority.toLowerCase(),
    verification,
    verificationType:
      dto.verificationType ||
      (verification.toLowerCase().includes('verified')
        ? 'verified'
        : verification.toLowerCase().includes('need')
        ? 'warning'
        : 'pending'),
    assignedStaff: dto.assignedStaff || 'I. Senanayake',
    assignedToUserId: dto.assignedToUserId || null,
    status,
    statusEnum: dto.statusEnum,
    statusType: dto.statusType || status.toLowerCase().replace(/\s+/g, '-'),
    affectedPeople:
      typeof dto.affectedPeople === 'string'
        ? dto.affectedPeople
        : `${dto.affectedPeopleCount || dto.affectedPeople || 1} people`,
    currentSafety: dto.currentSafety || 'Reported safe location',
    accessibility: dto.accessibility || 'None specified',
    submittedAgo: dto.submittedAgo || 'Just now',
    citizenQuote: dto.citizenQuote || dto.description || '',
    notes: Array.isArray(dto.notes) ? dto.notes : [],
    isLiveBackendRecord: true
  };
};

export const incidentService = {
  getDashboard: async () => {
    return await apiClient.get('/incidents/dashboard');
  },

  getAll: async (params = {}) => {
    return await apiClient.get('/incidents', { params });
  },

  getById: async (id) => {
    return await apiClient.get(`/incidents/${encodeURIComponent(id)}`);
  },

  create: async (data) => {
    return await apiClient.post('/incidents', data);
  },

  update: async (id, data) => {
    return await apiClient.put(`/incidents/${encodeURIComponent(id)}`, data);
  },

  getMyAssigned: async () => {
    return await apiClient.get('/incidents/my-assigned');
  },

  getUnassigned: async () => {
    return await apiClient.get('/incidents/unassigned');
  },

  assign: async (id, data) => {
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/assign`, data);
  },

  reassign: async (id, data) => {
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/reassign`, data);
  },

  updateStatus: async (id, data) => {
    return await apiClient.patch(`/incidents/${encodeURIComponent(id)}/status`, data);
  },

  updatePriority: async (id, data) => {
    return await apiClient.patch(`/incidents/${encodeURIComponent(id)}/priority`, data);
  },

  verify: async (id, data) => {
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/verify`, data);
  },

  escalate: async (id, data) => {
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/escalate`, data);
  },

  resolve: async (id, data) => {
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/resolve`, data);
  },

  close: async (id, data) => {
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/close`, data);
  },

  getHistory: async (id) => {
    return await apiClient.get(`/incidents/${encodeURIComponent(id)}/history`);
  },

  getPossibleDuplicates: async (id) => {
    return await apiClient.get(`/incidents/${encodeURIComponent(id)}/possible-duplicates`);
  },

  merge: async (id, data) => {
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/merge`, data);
  },

  getAIReview: async (id) => {
    return await apiClient.get(`/incidents/${encodeURIComponent(id)}/ai-review`);
  },

  generateAIReview: async (id) => {
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/ai-review/generate`, {});
  },

  recordAIReviewDecision: async (id, data) => {
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/ai-review/decision`, data);
  },

  getCommunications: async (id) => {
    return await apiClient.get(`/incidents/${encodeURIComponent(id)}/communications`);
  },

  addCommunication: async (id, data) => {
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/communications`, data);
  },

  getReportSummary: async (operation) => {
    const params = operation ? { operation } : {};
    return await apiClient.get('/incidents/reports/summary', { params });
  }
};

export default incidentService;

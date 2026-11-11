import apiClient from './apiClient';

let authPromise = null;

const ensureCaseManagerSession = async () => {
  const existingToken = localStorage.getItem('token');
  if (existingToken) return existingToken;

  if (!authPromise) {
    authPromise = apiClient
      .post('/auth/login', {
        email: 'ishara.senanayake@reliefcore.org',
        password: 'Password123!'
      })
      .then((res) => {
        const token = res?.data?.token || res?.token;
        if (token) {
          localStorage.setItem('token', token);
        }
        return token;
      })
      .catch(() => null)
      .finally(() => {
        authPromise = null;
      });
  }

  return await authPromise;
};

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
    await ensureCaseManagerSession();
    return await apiClient.get('/incidents/dashboard');
  },

  getAll: async (params = {}) => {
    await ensureCaseManagerSession();
    return await apiClient.get('/incidents', { params });
  },

  getById: async (id) => {
    await ensureCaseManagerSession();
    return await apiClient.get(`/incidents/${encodeURIComponent(id)}`);
  },

  create: async (data) => {
    await ensureCaseManagerSession();
    return await apiClient.post('/incidents', data);
  },

  update: async (id, data) => {
    await ensureCaseManagerSession();
    return await apiClient.put(`/incidents/${encodeURIComponent(id)}`, data);
  },

  getMyAssigned: async () => {
    await ensureCaseManagerSession();
    return await apiClient.get('/incidents/my-assigned');
  },

  getUnassigned: async () => {
    await ensureCaseManagerSession();
    return await apiClient.get('/incidents/unassigned');
  },

  assign: async (id, data) => {
    await ensureCaseManagerSession();
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/assign`, data);
  },

  reassign: async (id, data) => {
    await ensureCaseManagerSession();
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/reassign`, data);
  },

  updateStatus: async (id, data) => {
    await ensureCaseManagerSession();
    return await apiClient.patch(`/incidents/${encodeURIComponent(id)}/status`, data);
  },

  updatePriority: async (id, data) => {
    await ensureCaseManagerSession();
    return await apiClient.patch(`/incidents/${encodeURIComponent(id)}/priority`, data);
  },

  verify: async (id, data) => {
    await ensureCaseManagerSession();
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/verify`, data);
  },

  escalate: async (id, data) => {
    await ensureCaseManagerSession();
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/escalate`, data);
  },

  resolve: async (id, data) => {
    await ensureCaseManagerSession();
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/resolve`, data);
  },

  close: async (id, data) => {
    await ensureCaseManagerSession();
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/close`, data);
  },

  getHistory: async (id) => {
    await ensureCaseManagerSession();
    return await apiClient.get(`/incidents/${encodeURIComponent(id)}/history`);
  },

  getPossibleDuplicates: async (id) => {
    await ensureCaseManagerSession();
    return await apiClient.get(`/incidents/${encodeURIComponent(id)}/possible-duplicates`);
  },

  merge: async (id, data) => {
    await ensureCaseManagerSession();
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/merge`, data);
  },

  getAIReview: async (id) => {
    await ensureCaseManagerSession();
    return await apiClient.get(`/incidents/${encodeURIComponent(id)}/ai-review`);
  },

  generateAIReview: async (id) => {
    await ensureCaseManagerSession();
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/ai-review/generate`, {});
  },

  recordAIReviewDecision: async (id, data) => {
    await ensureCaseManagerSession();
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/ai-review/decision`, data);
  },

  getCommunications: async (id) => {
    await ensureCaseManagerSession();
    return await apiClient.get(`/incidents/${encodeURIComponent(id)}/communications`);
  },

  addCommunication: async (id, data) => {
    await ensureCaseManagerSession();
    return await apiClient.post(`/incidents/${encodeURIComponent(id)}/communications`, data);
  },

  getReportSummary: async (operation) => {
    await ensureCaseManagerSession();
    const params = operation ? { operation } : {};
    return await apiClient.get('/incidents/reports/summary', { params });
  }
};

export default incidentService;


import apiClient from './apiClient';

export const crisisService = {
  /**
   * Fetches high-level operational telemetry and counts for active crises.
   */
  getSummaryStats: async () => {
    return await apiClient.get('/crises/summary');
  },

  /**
   * Retrieves a list of crisis events with optional filters.
   */
  getCrises: async ({ isActive, disasterType, minSeverity, search } = {}) => {
    const params = new URLSearchParams();
    if (typeof isActive === 'boolean') params.append('isActive', isActive.toString());
    if (typeof disasterType === 'number') params.append('disasterType', disasterType.toString());
    if (typeof minSeverity === 'number') params.append('minSeverity', minSeverity.toString());
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiClient.get(`/crises${query}`);
  },

  /**
   * Retrieves full dossier for a specific crisis, including requests, shelters, and teams.
   */
  getCrisisById: async (id) => {
    return await apiClient.get(`/crises/${id}`);
  },

  /**
   * Declares and launches a new crisis event operational zone.
   */
  createCrisis: async (crisisData) => {
    return await apiClient.post('/crises', crisisData);
  },

  /**
   * Updates operational parameters, severity, and area boundaries for an existing crisis.
   */
  updateCrisis: async (id, crisisData) => {
    return await apiClient.put(`/crises/${id}`, crisisData);
  },

  /**
   * Marks a crisis event as resolved/closed with optional resolution summary.
   */
  closeCrisis: async (id, resolutionData = {}) => {
    return await apiClient.put(`/crises/${id}/close`, resolutionData);
  },

  /**
   * Dispatches and assigns an emergency response unit to a crisis.
   */
  assignResponseTeam: async (id, teamData) => {
    return await apiClient.post(`/crises/${id}/assign-team`, teamData);
  },

  /**
   * Retrieves hazard polygon zones for mapping.
   */
  getHazardZones: async (crisisId = null) => {
    const url = crisisId ? `/crises/${crisisId}/hazard-zones` : '/crises/hazard-zones';
    return await apiClient.get(url);
  }
};

export default crisisService;


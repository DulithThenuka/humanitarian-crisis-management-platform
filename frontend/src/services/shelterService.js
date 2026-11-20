import apiClient from './apiClient';

export const shelterService = {
  /**
   * Fetches all verified shelters with optional filtering (query, district, status).
   */
  getAll: async (params = {}) => {
    return await apiClient.get('/shelters', { params });
  },

  getShelters: async (params = {}) => {
    return await apiClient.get('/shelters', { params });
  },

  /**
   * Fetches real-time shelter capacity and district-by-district breakdown telemetry.
   */
  getSummary: async () => {
    return await apiClient.get('/shelters/summary');
  },

  /**
   * Fetches the complete operational dashboard telemetry for Shelter Administrators.
   */
  getDashboard: async () => {
    return await apiClient.get('/shelters/dashboard');
  },

  /**
   * Fetches a single shelter by GUID.
   */
  getById: async (id) => {
    return await apiClient.get(`/shelters/${id}`);
  },

  /**
   * Finds nearest active shelters around the specified coordinates.
   */
  getNearby: async (lat, lon, radius = 25) => {
    return await apiClient.get('/shelters/nearby', { params: { lat, lon, radius } });
  },

  /**
   * Creates a new operational shelter record (Shelter Admin).
   */
  create: async (shelterData) => {
    return await apiClient.post('/shelters', shelterData);
  },

  /**
   * Updates an existing shelter's operational capacity, facilities or contacts.
   */
  update: async (id, shelterData) => {
    return await apiClient.put(`/shelters/${id}`, shelterData);
  },

  /**
   * Executes a reviewed operational action (allocation, clarification, escalation).
   */
  executeAction: async (id, actionData) => {
    return await apiClient.post(`/shelters/${id}/action`, actionData);
  },

  /**
   * Allocates an evacuee or family to a shelter (authorized responders).
   */
  allocate: async (allocationData) => {
    return await apiClient.post('/shelters/allocate', allocationData);
  },

  /**
   * Gets placement allocation records with optional filters (shelterId, status, search).
   */
  getPlacements: async (params = {}) => {
    return await apiClient.get('/shelters/placements', { params });
  },

  /**
   * Creates a new evacuee placement allocation record.
   */
  createPlacement: async (placementData) => {
    return await apiClient.post('/shelters/placements', placementData);
  },

  /**
   * Updates status for an evacuee placement (e.g. Discharged, Reallocated).
   */
  updatePlacementStatus: async (id, statusData) => {
    return await apiClient.put(`/shelters/placements/${id}/status`, statusData);
  },

  /**
   * Gets shelter supply and resource requests.
   */
  getResourceRequests: async (params = {}) => {
    return await apiClient.get('/shelters/resource-requests', { params });
  },

  /**
   * Submits a resource request for a shelter.
   */
  createResourceRequest: async (requestData) => {
    return await apiClient.post('/shelters/resource-requests', requestData);
  },

  /**
   * Updates dispatch or delivery status for a shelter resource request.
   */
  updateResourceRequestStatus: async (id, statusData) => {
    return await apiClient.put(`/shelters/resource-requests/${id}/status`, statusData);
  },

  /**
   * Gets aggregated shelter reports and daily summary analytics.
   */
  getReports: async () => {
    return await apiClient.get('/shelters/reports');
  },

  /**
   * Exports shelter operational reports in requested format (PDF, CSV, JSON).
   */
  exportReport: async (reportType = 'full-occupancy', format = 'csv') => {
    return await apiClient.get('/shelters/reports/export', { params: { reportType, format } });
  }
};

export default shelterService;

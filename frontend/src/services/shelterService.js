import apiClient from './apiClient';

export const shelterService = {
  /**
   * Fetches all verified shelters with optional filtering (query, district, status).
   */
  getAll: async (params = {}) => {
    return await apiClient.get('/shelters', { params });
  },

  /**
   * Fetches real-time shelter capacity and district-by-district breakdown telemetry.
   */
  getSummary: async () => {
    return await apiClient.get('/shelters/summary');
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
   * Allocates an evacuee or family to a shelter (authorized responders).
   */
  allocate: async (allocationData) => {
    return await apiClient.post('/shelters/allocate', allocationData);
  }
};

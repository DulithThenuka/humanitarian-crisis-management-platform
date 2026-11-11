import apiClient from './apiClient';

export const homeService = {
  /**
   * Fetches real-time operational telemetry, active crisis status,
   * shelter counts, and assistance categories for the home page.
   */
  getSummary: async () => {
    return await apiClient.get('/home/summary');
  },

  /**
   * Public tracking query by Request ID, phone number, or reference.
   */
  trackRequest: async (reference) => {
    return await apiClient.get(`/home/track-request/${encodeURIComponent(reference)}`);
  },

  /**
   * Emergency field safety guides & packing checklists.
   */
  getSafetyGuidance: async () => {
    return await apiClient.get('/home/safety-guidance');
  },

  /**
   * Current high-priority crisis broadcasts and weather alerts.
   */
  getAlerts: async () => {
    return await apiClient.get('/home/alerts');
  },

  /**
   * Emergency hotline directory (DMC 117, Ambulance 1990, Police 119).
   */
  getHotlines: async () => {
    return await apiClient.get('/home/hotlines');
  }
};


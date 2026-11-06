import apiClient from './apiClient';

export const aiGovernanceService = {
  overrideDecision: async (overrideData) => {
    return await apiClient.post('/aireview/override', overrideData);
  },
  approveDecision: async (approveData) => {
    return await apiClient.post('/aireview/approve', approveData);
  }
};

import apiClient from './apiClient';

export const volunteerService = {
  getAll: async () => {
    return await apiClient.get('/volunteers');
  },
  assignTask: async (assignmentData) => {
    return await apiClient.post('/volunteers/assign', assignmentData);
  }
};

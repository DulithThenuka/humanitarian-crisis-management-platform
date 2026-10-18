import apiClient from './apiClient';

export const authService = {
  login: async (credentials) => {
    return await apiClient.post('/auth/login', credentials);
  },
  register: async (userData) => {
    return await apiClient.post('/auth/register', userData);
  }
};

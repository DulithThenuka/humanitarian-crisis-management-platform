import apiClient from './apiClient';

export const authService = {
  login: async (credentials) => {
    return await apiClient.post('/auth/login', credentials);
  },
  register: async (userData) => {
    return await apiClient.post('/auth/register', userData);
  },
  getCurrentUser: async () => {
    return await apiClient.get('/auth/me');
  },
  updateProfile: async (userData) => {
    return await apiClient.put('/auth/me', userData);
  },
  logout: async () => {
    return await apiClient.post('/auth/logout');
  }
};

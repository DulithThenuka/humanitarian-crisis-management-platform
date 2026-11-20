import apiClient from './apiClient';

export const resourceService = {
  // Inventory
  getInventory: async (params) => {
    return await apiClient.get('/resources', { params });
  },
  getLowStock: async () => {
    return await apiClient.get('/resources/low-stock');
  },
  getById: async (id) => {
    return await apiClient.get(`/resources/${id}`);
  },
  createResource: async (dto) => {
    return await apiClient.post('/resources', dto);
  },
  updateResource: async (id, dto) => {
    return await apiClient.put(`/resources/${id}`, dto);
  },
  deleteResource: async (id) => {
    return await apiClient.delete(`/resources/${id}`);
  },
  adjustStock: async (id, dto) => {
    return await apiClient.post(`/resources/${id}/adjust-stock`, dto);
  },

  // Overview / Telemetry
  getOverview: async () => {
    return await apiClient.get('/resources/overview');
  },
  getDashboard: async () => {
    return await apiClient.get('/resources/dashboard');
  },

  // Allocations
  getAllocations: async (params) => {
    return await apiClient.get('/resources/allocations', { params });
  },
  approveAllocation: async (id, dto) => {
    return await apiClient.post(`/resources/allocations/${id}/approve`, dto);
  },
  rejectAllocation: async (id, dto) => {
    return await apiClient.post(`/resources/allocations/${id}/reject`, dto);
  },
  clarifyAllocation: async (id, note) => {
    return await apiClient.post(`/resources/allocations/${id}/clarify`, JSON.stringify(note), {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  dispatch: async (dispatchData) => {
    return await apiClient.post('/resources/dispatch', dispatchData);
  },

  // Dispatches & Tracking
  getDispatches: async (params) => {
    return await apiClient.get('/resources/dispatches', { params });
  },
  updateDispatchStatus: async (id, dto) => {
    return await apiClient.post(`/resources/dispatches/${id}/status`, dto);
  },
  confirmDelivery: async (id, dto) => {
    return await apiClient.post(`/resources/dispatches/${id}/confirm-delivery`, dto);
  },

  // Suppliers & Donations
  getSuppliers: async (params) => {
    return await apiClient.get('/resources/suppliers', { params });
  },
  createSupplier: async (dto) => {
    return await apiClient.post('/resources/suppliers', dto);
  },
  getDonations: async (params) => {
    return await apiClient.get('/resources/donations', { params });
  },

  // Alerts & Reorder
  getAlerts: async () => {
    return await apiClient.get('/resources/alerts');
  },
  reorder: async (dto) => {
    return await apiClient.post('/resources/reorder', dto);
  },

  // Activity Audit & Export
  getActivity: async (params) => {
    return await apiClient.get('/resources/activity', { params });
  },
  exportCsv: async (type = 'inventory') => {
    return await apiClient.get('/resources/export', {
      params: { type },
      responseType: 'blob'
    });
  },

  // Duty Status
  getDutyStatus: async () => {
    return await apiClient.get('/resources/duty-status');
  },
  setDutyStatus: async (isOnDuty) => {
    return await apiClient.post('/resources/duty-status', { isOnDuty });
  }
};

export default resourceService;

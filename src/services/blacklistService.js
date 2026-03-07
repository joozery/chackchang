import { apiCall, API_CONFIG } from '../config/api';

const blacklistService = {
  // Get all approved blacklist (public)
  async getApproved(search = '') {
    const endpoint = search 
      ? `${API_CONFIG.ENDPOINTS.BLACKLIST_PUBLIC}?search=${encodeURIComponent(search)}`
      : API_CONFIG.ENDPOINTS.BLACKLIST_PUBLIC;
    
    const response = await apiCall(endpoint, {
      method: 'GET',
    });
    
    return response.data || [];
  },

  // Get blacklist by ID (public)
  async getById(id) {
    const response = await apiCall(API_CONFIG.ENDPOINTS.BLACKLIST_PUBLIC_BY_ID(id), {
      method: 'GET',
    });
    
    return response.data || null;
  },

  // Get statistics
  async getStats() {
    const response = await apiCall(API_CONFIG.ENDPOINTS.BLACKLIST_STATS, {
      method: 'GET',
    });
    
    return response.data || {};
  },

  // Get all blacklist with filters (admin)
  async getAll(filters = {}) {
    let endpoint = API_CONFIG.ENDPOINTS.BLACKLIST;
    const params = new URLSearchParams();
    
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    if (filters.limit) {
      params.append('limit', filters.limit);
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    const response = await apiCall(endpoint, {
      method: 'GET',
    });
    
    return response.data || [];
  },

  // Create new entry
  async create(data) {
    const response = await apiCall(API_CONFIG.ENDPOINTS.BLACKLIST, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    return response.data || null;
  },

  // Update entry
  async update(id, data) {
    const response = await apiCall(API_CONFIG.ENDPOINTS.BLACKLIST_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    return response;
  },

  // Update status
  async updateStatus(id, status) {
    const response = await apiCall(API_CONFIG.ENDPOINTS.BLACKLIST_UPDATE_STATUS(id), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    
    return response;
  },

  // Delete entry
  async delete(id) {
    const response = await apiCall(API_CONFIG.ENDPOINTS.BLACKLIST_BY_ID(id), {
      method: 'DELETE',
    });
    
    return response;
  },

  // Check API health
  async checkHealth() {
    const response = await apiCall(API_CONFIG.ENDPOINTS.HEALTH, {
      method: 'GET',
    });
    
    return response;
  },
};

export default blacklistService;


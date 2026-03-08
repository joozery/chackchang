import { API_CONFIG, apiCall } from '@/config/api';

const technicianService = {
  // Get all technicians with optional filters
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.workType) queryParams.append('workType', params.workType);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const endpoint = `/technicians${queryString ? `?${queryString}` : ''}`;

    const response = await apiCall(endpoint, {
      method: 'GET',
    });

    return response;
  },

  // Get technician by ID
  getById: async (id) => {
    const response = await apiCall(`/technicians/${id}`, {
      method: 'GET',
    });

    return response;
  },
  // Update technician (admin only)
  update: async (id, data) => {
    const response = await apiCall(`/technicians/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return response;
  },

  delete: async (id) => {
    const response = await apiCall(`/technicians/${id}`, {
      method: 'DELETE',
    });

    return response;
  },

  // Get portfolio items
  getPortfolioItems: async (id) => {
    const response = await apiCall(`/technicians/${id}/portfolios`, {
      method: 'GET',
    });
    return response;
  },

  // Add portfolio item
  addPortfolioItem: async (formData) => {
    // Note: apiCall might need to handle FormData correctly (no Content-Type set)
    // usually we just let fetch set the boundary
    const response = await apiCall('/technicians/portfolios', {
      method: 'POST',
      body: formData,
    }, true); // assume third param `isFormData` if needed, or pass directly

    return response;
  },

  // Delete portfolio item
  deletePortfolioItem: async (id) => {
    const response = await apiCall(`/technicians/portfolios/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

export default technicianService;



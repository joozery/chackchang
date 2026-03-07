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
};

export default technicianService;



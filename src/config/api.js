// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Health & Info
    HEALTH: '/health',
    INFO: '/',
    
    // Blacklist - Public
    BLACKLIST_PUBLIC: '/blacklist/public',
    BLACKLIST_PUBLIC_BY_ID: (id) => `/blacklist/public/${id}`,
    BLACKLIST_STATS: '/blacklist/stats',
    
    // Blacklist - Admin
    BLACKLIST: '/blacklist',
    BLACKLIST_BY_ID: (id) => `/blacklist/${id}`,
    BLACKLIST_UPDATE_STATUS: (id) => `/blacklist/${id}/status`,
  }
};

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add authorization token if available (for future use)
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default apiCall;


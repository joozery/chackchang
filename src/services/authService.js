import apiCall from '@/config/api';

const authService = {
  // Get current user info
  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await apiCall('/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  },

  // Update user profile
  async updateProfile(data) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  }
};

export default authService;



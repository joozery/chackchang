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

    let body;
    if (data.image) {
      body = new FormData();
      Object.keys(data).forEach(key => {
        body.append(key, data[key]);
      });
    } else {
      body = JSON.stringify(data);
    }

    const response = await apiCall('/auth/profile', {
      method: 'PUT',
      body,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response;
  }
};

export default authService;



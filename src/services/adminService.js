import apiCall from '@/config/api';

const adminService = {
    // Get all admins
    async getAllAdmins() {
        const response = await apiCall('/admins');
        return response.data;
    },

    // Create new admin
    async createAdmin(data) {
        const response = await apiCall('/admins', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response.data;
    },

    // Update admin
    async updateAdmin(id, data) {
        const response = await apiCall(`/admins/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response.data;
    },

    // Delete admin
    async deleteAdmin(id) {
        const response = await apiCall(`/admins/${id}`, {
            method: 'DELETE'
        });
        return response.data;
    }
};

export default adminService;

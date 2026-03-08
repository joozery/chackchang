import apiCall from '../config/api';

const userService = {
    getAll: async () => {
        return await apiCall('/users', {
            method: 'GET'
        });
    },

    create: async (userData) => {
        return await apiCall('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    update: async (id, userData) => {
        return await apiCall(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    delete: async (id) => {
        return await apiCall(`/users/${id}`, {
            method: 'DELETE'
        });
    },

    toggleStatus: async (id) => {
        return await apiCall(`/users/${id}/toggle-status`, {
            method: 'PATCH'
        });
    }
};

export default userService;

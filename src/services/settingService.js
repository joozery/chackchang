import { apiCall } from '../config/api';

const settingService = {
    get: async (key) => {
        const response = await apiCall(`/settings/${key}`, {
            method: 'GET',
        });
        return response.data;
    },

    update: async (key, value) => {
        const response = await apiCall(`/settings/${key}`, {
            method: 'PUT',
            body: JSON.stringify({ value }),
        });
        return response;
    }
};

export default settingService;

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Ver llamadas en consola
api.interceptors.request.use(
    (config) => {
        console.log(`${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log(`${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(`Error: ${error.message}`);
        return Promise.reject(error);
    }
);

export const bpartnerService = {
    // Obtener todos los terceros
    getAll: async (searchTerm = '') => {
        try {
            const response = await api.get('/bpartners', {
                params: { search: searchTerm },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Crear un nuevo tercero
    create: async (data) => {
        try {
            const response = await api.post('/bpartners', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;

        }
    },

    // Obtener grupos de terceros
    getGroups: async () => {
        try {
            const response = await api.get('/bpartners/groups');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default api;

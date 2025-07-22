// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const auth = {
    login: (username: string, password: string) =>
        api.post('/auth/login', { username, password }),
};

export const users = {
    getAllUsers: () => api.get('/users/'),
    getUserById: (id: string) => api.get(`/users/${id}`),
    addUser: (userData: any) => api.post('/users/', userData),
    updateUser: (id: string, userData: any) => api.put(`/users/${id}`, userData),
    deleteUser: (id: string) => api.delete(`/users/${id}`),
};

export const healthData = {
    getAllHealthData: () => api.get('/health-data/'),
    getUserHealthData: (userId: string) => api.get(`/health-data/user/${userId}`),
    getHealthDataById: (id: string) => api.get(`/health-data/${id}`),
    addHealthData: (data: any) => api.post('/health-data/', data),
    updateHealthData: (id: string, data: any) => api.put(`/health-data/${id}`, data),
    deleteHealthData: (id: string) => api.delete(`/health-data/${id}`),
};

export default api;
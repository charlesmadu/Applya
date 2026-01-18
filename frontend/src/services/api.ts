import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Applications API
export const applicationsAPI = {
  getAll: async () => {
    const response = await api.get('/applications');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  create: async (data: {
    title: string;
    company: string;
    location?: string;
    salary?: string;
    url?: string;
    description?: string;
    notes?: string;
    contactName?: string;
    contactEmail?: string;
    appliedDate?: string;
    status?: 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  }) => {
    const response = await api.post('/applications', data);
    return response.data;
  },

  update: async (id: number, data: Partial<{
    title: string;
    company: string;
    location: string;
    salary: string;
    url: string;
    description: string;
    notes: string;
    contactName: string;
    contactEmail: string;
    appliedDate: string;
    status: 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  }>) => {
    const response = await api.put(`/applications/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: number, status: 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED') => {
    const response = await api.patch(`/applications/${id}/status?status=${status}`);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/applications/${id}`);
  },

  getStats: async () => {
    const response = await api.get('/applications/stats');
    return response.data;
  },
};

export default api;
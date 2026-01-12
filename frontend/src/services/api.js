import axios from 'axios';

// API Base Configuration
// Use relative path to leverage Vite proxy configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for adding auth tokens in the future
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

// ===== Problem APIs =====

export const problemsApi = {
  // Get all problems with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.team) params.append('team', filters.team);
    
    const queryString = params.toString();
    const url = queryString ? `/problems?${queryString}` : '/problems';
    
    return apiClient.get(url);
  },

  // Get single problem by ID
  getById: async (id) => {
    return apiClient.get(`/problems/${id}`);
  },

  // Create new problem
  create: async (data) => {
    return apiClient.post('/problems', data);
  },

  // Update existing problem
  update: async (id, data) => {
    return apiClient.put(`/problems/${id}`, data);
  },

  // Delete problem
  delete: async (id) => {
    return apiClient.delete(`/problems/${id}`);
  },

  // Get statistics
  getStatistics: async () => {
    return apiClient.get('/problems/statistics');
  },
};

// ===== Root Cause APIs =====

export const rootCausesApi = {
  // Get root cause tree for a problem
  getTreeByProblemId: async (problemId) => {
    return apiClient.get(`/problems/${problemId}/root-causes`);
  },

  // Get single root cause
  getById: async (id) => {
    return apiClient.get(`/root-causes/${id}`);
  },

  // Create new root cause
  create: async (data) => {
    return apiClient.post('/root-causes', data);
  },

  // Update existing root cause
  update: async (id, data) => {
    return apiClient.put(`/root-causes/${id}`, data);
  },

  // Delete root cause
  delete: async (id) => {
    return apiClient.delete(`/root-causes/${id}`);
  },
};

export default apiClient;

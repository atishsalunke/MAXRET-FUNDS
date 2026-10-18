import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000,
});

// Request interceptor
API.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json';
  return config;
});

// Response interceptor
API.interceptors.response.use(
  res => res.data,
  err => {
    const message = err.response?.data?.error || err.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

export const analyzeProfile = (profileData) => API.post('/analyze', profileData);
export const getFundById = (id) => API.get(`/fund/${id}`);
export const getAllFunds = (filters = {}) => API.get('/funds', { params: filters });
export const getFundNAVHistory = (id) => API.get(`/fund/${id}/nav-history`);
export const healthCheck = () => API.get('/health');

export default API;
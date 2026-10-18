import axios from 'axios';

const AUTH_API = axios.create({
  baseURL: process.env.REACT_APP_AUTH_API_URL || (
    process.env.REACT_APP_API_URL
      ? `${process.env.REACT_APP_API_URL.replace(/\/+$/, '')}/auth`
      : '/api/auth'
  ),
  timeout: 10000,
});

AUTH_API.interceptors.response.use(
  res => res.data,
  err => Promise.reject(new Error(err.response?.data?.error || 'Network error'))
);

export const registerUser = (data) => AUTH_API.post('/register', data);
export const loginUser = (data) => AUTH_API.post('/login', data);
export const getMe = (email) => AUTH_API.get('/me', { headers: { 'x-user-email': email } });
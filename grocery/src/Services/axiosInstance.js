import axios from 'axios';
import LoginService from './loginService';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081', // Your backend base URL
});

// Request interceptor for adding the token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = LoginService.getToken();
    if (token) {
        console.log(token)
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally (optional)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration or other errors here
    if (error.response && error.response.status === 401) {
      // For example, logout the user if unauthorized
      LoginService.logout();
      // Optionally, redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

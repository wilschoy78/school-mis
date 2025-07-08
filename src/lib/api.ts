import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error has a response and a message
    if (error.response && error.response.data && error.response.data.message) {
      // Reject with the custom error message from the API
      return Promise.reject(new Error(error.response.data.message));
    }
    // For other types of errors, reject with the original error
    return Promise.reject(error);
  },
);

export default api;

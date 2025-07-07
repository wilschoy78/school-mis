import api from '@/lib/api';
import { LoginFormData, RegisterFormData } from '@/types';

export const authService = {
  login: async (credentials: LoginFormData) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (userData: RegisterFormData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    // For now, we just remove the token from local storage
    localStorage.removeItem('token');
  },
};

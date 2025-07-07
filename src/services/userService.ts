import api from '@/lib/api';
import { User, UserRole, RegisterFormData } from '@/types/auth';

export const userService = {
  getUsers: async (
    page: number = 1,
    limit: number = 10,
    roles?: UserRole[] | 'all',
    search?: string,
  ): Promise<{ users: User[]; total: number }> => {
    const params: any = { page, limit };
    if (roles && roles !== 'all') {
      params.roles = roles;
    }
    if (search) {
      params.search = search;
    }
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  addUser: async (userData: RegisterFormData): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  updateUserStatus: async (id: string, status: 'active' | 'inactive' | 'suspended'): Promise<User> => {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data;
  },
};

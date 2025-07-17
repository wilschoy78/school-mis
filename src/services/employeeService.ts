import api from '@/lib/api';
import {
  Position,
  Department,
  CreatePositionData,
  CreateDepartmentData,
  EmployeeFormData,
  EmployeeStats,
  EmployeeFilters,
} from '../types/employee';
import { User } from '../types/auth';

// Position API calls
export const positionService = {
  async getPositions(category?: string, isActive?: boolean): Promise<Position[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (isActive !== undefined) params.append('isActive', isActive.toString());
    
    const response = await api.get(`/positions?${params.toString()}`);
    return response.data;
  },

  async getPosition(id: number): Promise<Position> {
    const response = await api.get(`/positions/${id}`);
    return response.data;
  },

  async createPosition(data: CreatePositionData): Promise<Position> {
    const response = await api.post('/positions', data);
    return response.data;
  },

  async updatePosition(id: number, data: Partial<CreatePositionData>): Promise<Position> {
    const response = await api.patch(`/positions/${id}`, data);
    return response.data;
  },

  async togglePositionActive(id: number): Promise<Position> {
    const response = await api.patch(`/positions/${id}/toggle-active`);
    return response.data;
  },
};

// Department API calls
export const departmentService = {
  async getDepartments(category?: string, isActive?: boolean): Promise<Department[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (isActive !== undefined) params.append('isActive', isActive.toString());
    
    const response = await api.get(`/departments?${params.toString()}`);
    return response.data;
  },

  async getDepartment(id: number): Promise<Department> {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  async createDepartment(data: CreateDepartmentData): Promise<Department> {
    const response = await api.post('/departments', data);
    return response.data;
  },

  async updateDepartment(id: number, data: Partial<CreateDepartmentData>): Promise<Department> {
    const response = await api.patch(`/departments/${id}`, data);
    return response.data;
  },

  async toggleDepartmentActive(id: number): Promise<Department> {
    const response = await api.patch(`/departments/${id}/toggle-active`);
    return response.data;
  },
};

// Employee API calls
export const employeeService = {
  async getEmployees(filters: EmployeeFilters = {}): Promise<{ users: User[]; total: number }> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.department) params.append('department', filters.department);
    if (filters.position) params.append('position', filters.position);
    if (filters.search) params.append('search', filters.search);
    
    const response = await api.get(`/users/employees/list?${params.toString()}`);
    return response.data;
  },

  async getEmployeeStats(): Promise<EmployeeStats> {
    const response = await api.get('/users/employees/stats');
    return response.data;
  },

  async createEmployee(data: EmployeeFormData): Promise<User> {
    const response = await api.post('/users', data);
    return response.data;
  },

  async updateEmployee(id: number, data: Partial<EmployeeFormData>): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async updateEmployeeStatus(id: number, status: 'active' | 'inactive' | 'suspended'): Promise<User> {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data;
  },
};

export default {
  position: positionService,
  department: departmentService,
  employee: employeeService,
};
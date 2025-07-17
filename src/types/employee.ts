// Employee-related types and interfaces

export interface Position {
  id: number;
  name: string;
  description?: string;
  category: 'teaching' | 'administrative' | 'support';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  category: 'academic' | 'administrative' | 'support';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePositionData {
  name: string;
  description?: string;
  category?: 'teaching' | 'administrative' | 'support';
  isActive?: boolean;
}

export interface CreateDepartmentData {
  name: string;
  description?: string;
  category?: 'academic' | 'administrative' | 'support';
  isActive?: boolean;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone?: string;
  roles: string[];
  department?: string;
  position?: string;
  employeeId?: string;
  hireDate?: string;
  salary?: number;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
  dateOfBirth?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface EmployeeStats {
  totalEmployees: number;
  byDepartment: { department: string; count: number }[];
  byPosition: { position: string; count: number }[];
  byStatus: { status: string; count: number }[];
}

export interface EmployeeFilters {
  department?: string;
  position?: string;
  search?: string;
  page?: number;
  limit?: number;
}
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  CASHIER = 'cashier',
  REGISTRAR = 'registrar',
  TEACHER = 'teacher',
  STUDENT = 'student',
  LIBRARIAN = 'librarian',
  STAFF = 'staff',
  PARENT = 'parent',
}

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  email: string;
  // password?: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  department?: string;
  status?: 'active' | 'inactive' | 'suspended';
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  avatar?: string;
  department?: string;
  position?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended';
  joinDate?: Date;
};

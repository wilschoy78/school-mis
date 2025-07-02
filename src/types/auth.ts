export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  REGISTRAR = 'registrar',
  CASHIER = 'cashier',
  TEACHER = 'teacher',
  LIBRARIAN = 'librarian',
  STUDENT = 'student'
}

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  roles: UserRole[];
  avatar?: string;
  department?: string;
  position?: string;
  phone?: string;
  status?: 'Active' | 'Inactive' | 'On Leave';
  joinDate?: Date;
};


export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  suffix: string;
  grade: string;
  section: string;
  gender: string;
  birthdate: Date;
  age: number;
  address: string;
  email: string;
  contact: string;
  guardianName: string;
  guardianContact: string;
};

export type StudentFormData = {
  firstName: string;
  lastName: string;
  middleName: string;
  suffix: string;
  grade: string;
  section: string;
  gender: string;
  birthdate: Date;
  age: string;
  address: string;
  email: string;
  contact: string;
  guardianName: string;
  guardianContact: string;
};

export type SortDirection = 'asc' | 'desc' | null;
export type SortField = 'firstName' | 'lastName' | 'grade' | 'section' | 'gender' | 'contact' | 'email' | 'age' | null;

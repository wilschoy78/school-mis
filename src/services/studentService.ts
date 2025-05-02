
import { Student, StudentFormData } from '@/types/student';
import { useApiService } from '@/utils/apiUtils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock data (similar to what's in Students.tsx)
const mockStudents: Student[] = [
  { 
    id: '1', 
    firstName: 'John', 
    lastName: 'Doe', 
    middleName: '', 
    suffix: '', 
    grade: 'Grade 10', 
    section: 'A', 
    gender: 'Male', 
    birthdate: new Date(2006, 5, 15),
    age: 17,
    address: '123 Main St, Anytown',
    email: 'john.doe@example.com',
    contact: '555-1234',
    guardianName: 'Mary Doe',
    guardianContact: '555-5678'
  },
  // ... mock data would continue here
];

export const useStudentService = () => {
  const api = useApiService();
  const queryClient = useQueryClient();
  
  // Get all students
  const useStudents = () => {
    return useQuery({
      queryKey: ['students'],
      queryFn: async () => {
        const response = await api.get<Student[]>('/students', {
          mockData: mockStudents,
          requireAuth: true
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Convert date strings to Date objects
        const students = response.data?.map(student => ({
          ...student,
          birthdate: new Date(student.birthdate)
        })) || [];
        
        return students;
      }
    });
  };
  
  // Get a single student by ID
  const useStudent = (id: string) => {
    return useQuery({
      queryKey: ['students', id],
      queryFn: async () => {
        const response = await api.get<Student>(`/students/${id}`, {
          mockData: mockStudents.find(s => s.id === id),
          requireAuth: true
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (!response.data) {
          throw new Error('Student not found');
        }
        
        // Convert date strings to Date objects
        const student = {
          ...response.data,
          birthdate: new Date(response.data.birthdate)
        };
        
        return student;
      },
      enabled: !!id
    });
  };
  
  // Create a new student
  const useCreateStudent = () => {
    return useMutation({
      mutationFn: async (studentData: StudentFormData) => {
        // Generate an ID for mock mode
        const newId = String(Math.floor(Math.random() * 10000));
        
        const response = await api.post<Student>('/students', studentData, {
          mockData: { id: newId, ...studentData, age: parseInt(studentData.age) || 0 },
          requireAuth: true
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        return response.data;
      },
      onSuccess: () => {
        // Invalidate the students query to refetch the updated list
        queryClient.invalidateQueries({ queryKey: ['students'] });
      }
    });
  };
  
  // Update an existing student
  const useUpdateStudent = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string, data: StudentFormData }) => {
        const response = await api.put<Student>(`/students/${id}`, data, {
          mockData: { id, ...data, age: parseInt(data.age) || 0 },
          requireAuth: true
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        return response.data;
      },
      onSuccess: (_, variables) => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['students'] });
        queryClient.invalidateQueries({ queryKey: ['students', variables.id] });
      }
    });
  };
  
  // Delete a student
  const useDeleteStudent = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const response = await api.remove<{ success: boolean }>(`/students/${id}`, {
          mockData: { success: true },
          requireAuth: true
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        return response.data;
      },
      onSuccess: (_, id) => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['students'] });
        queryClient.invalidateQueries({ queryKey: ['students', id] });
      }
    });
  };
  
  return {
    useStudents,
    useStudent,
    useCreateStudent,
    useUpdateStudent,
    useDeleteStudent
  };
};

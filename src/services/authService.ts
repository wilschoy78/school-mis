
import { User, UserRole } from '@/context/AuthContext';
import { useApiService } from '@/utils/apiUtils';
import { useMutation } from '@tanstack/react-query';

// Login request/response types
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export const useAuthService = () => {
  const api = useApiService();
  
  // Mock login function that simulates getting a token from the API
  const useLogin = () => {
    return useMutation({
      mutationFn: async ({ email, password }: LoginRequest) => {
        // In a real app, this would call your API's login endpoint
        const response = await api.post<LoginResponse>('/auth/login', { email, password }, {
          // Mock response for testing
          mockData: {
            user: getMockUser(email),
            token: 'mock-token-12345'
          },
          requireAuth: false // Login doesn't require auth
        });
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (!response.data?.user || !response.data?.token) {
          throw new Error('Invalid response from server');
        }
        
        // Store token in localStorage or secure storage
        // In a real app, you'd want to use secure storage for tokens
        localStorage.setItem('auth_token', response.data.token);
        
        return response.data.user;
      }
    });
  };
  
  // Helper function to generate mock user data based on email
  const getMockUser = (email: string): User => {
    // Determine role based on email
    let role = UserRole.ADMIN;
    if (email.includes('teacher')) {
      role = UserRole.TEACHER;
    } else if (email.includes('student')) {
      role = UserRole.STUDENT;
    } else if (email.includes('registrar')) {
      role = UserRole.REGISTRAR;
    } else if (email.includes('cashier')) {
      role = UserRole.CASHIER;
    } else if (email.includes('librarian')) {
      role = UserRole.LIBRARIAN;
    }
    
    // Generate employee ID for staff
    let employeeId = undefined;
    if (role !== UserRole.STUDENT) {
      employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    
    return {
      id: '1',
      name: email.split('@')[0].replace(/\./g, ' ').replace(/(\b\w)/g, (char) => char.toUpperCase()),
      email: email,
      role: role,
      roles: [role], // Initialize with primary role
      avatar: '',
      status: 'Active',
      joinDate: new Date(),
      employeeId, // Add employee ID for staff
    };
  };
  
  // Logout function - clear token
  const useLogout = () => {
    return useMutation({
      mutationFn: async () => {
        // In a real app, you might call an API endpoint to invalidate the token
        // For now, just remove from localStorage
        localStorage.removeItem('auth_token');
        return true;
      }
    });
  };
  
  // Function to check if user has a valid token
  const checkAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
  };
  
  return {
    useLogin,
    useLogout,
    checkAuthToken
  };
};

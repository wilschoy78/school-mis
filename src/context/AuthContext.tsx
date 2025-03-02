
import React, { createContext, useContext, useState, useEffect } from 'react';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  REGISTRAR = 'REGISTRAR',
  CASHIER = 'CASHIER',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (allowedRoles: UserRole[]) => boolean;
}

const initialState: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  checkPermission: () => false
};

const AuthContext = createContext<AuthContextType>(initialState);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    // For demo purposes, we'll simulate a successful login with any credentials
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: UserRole.ADMIN,
        avatar: '',
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const checkPermission = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

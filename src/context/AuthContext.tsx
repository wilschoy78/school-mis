
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginFormData } from '@/types';
import { authService } from '@/services/authService';
import { UserRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<boolean>;
  logout: () => void;
  checkPermission: (allowedRoles: UserRole[]) => boolean;
  updateUserProfile: (userData: Partial<User>) => void;
}

const initialState: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  checkPermission: () => false,
  updateUserProfile: () => {}
};

const AuthContext = createContext<AuthContextType>(initialState);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd verify the token with the backend
      // For now, we'll assume the token is valid and decode it
      // This is not secure and should be replaced with a proper implementation
      try {
        const decodedUser = JSON.parse(atob(token.split('.')[1]));
        setUser(decodedUser);
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginFormData): Promise<boolean> => {
    try {
      const { token } = await authService.login(credentials);
      localStorage.setItem('token', token);
      const decodedUser = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const checkPermission = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;

    // If user.roles array exists, check against it
    if (user.roles && user.roles.length > 0) {
      return user.roles.some(role => allowedRoles.includes(role));
    }

    // Fallback to checking the single user.role
    if (user.role) {
      return allowedRoles.includes(user.role);
    }

    return false;
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
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
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

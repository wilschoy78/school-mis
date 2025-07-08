
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginFormData } from '@/types';
import { authService } from '@/services/authService';
import { UserRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => void;
  checkPermission: (allowedRoles: UserRole[]) => boolean;
  updateUserProfile: (userData: Partial<User>) => void;
  mustChangePassword?: boolean;
}

const initialState: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  checkPermission: () => false,
  updateUserProfile: () => {},
  mustChangePassword: false,
};

const AuthContext = createContext<AuthContextType>(initialState);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else if (token) {
      // Fallback: if user object not stored, try decoding from token (less reliable for full user data)
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

  const login = async (credentials: LoginFormData): Promise<void> => {
    try {
      const response = await authService.login(credentials);
      const { token, user: loggedInUser, mustChangePassword } = response;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setMustChangePassword(mustChangePassword);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('user'); // Also remove user from local storage
    setUser(null);
    window.location.href = '/login';
  };

  const checkPermission = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;

    // If user.roles array exists, check against it
    if (user.roles && user.roles.length > 0) {
      return user.roles.some(role => allowedRoles.includes(role));
    }

    return false;
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser)); // Update user in local storage
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
        updateUserProfile,
        mustChangePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

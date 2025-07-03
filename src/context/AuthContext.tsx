
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

  const login = async (credentials: LoginFormData): Promise<boolean> => {
    try {
      const response = await authService.login(credentials);
      const { token, user: loggedInUser } = response; // Assuming response contains both token and user
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedInUser)); // Store the full user object
      setUser(loggedInUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('user'); // Also remove user from local storage
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
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

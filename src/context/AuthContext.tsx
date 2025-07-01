
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  REGISTRAR = 'REGISTRAR',
  CASHIER = 'CASHIER',
  TEACHER = 'TEACHER',
  LIBRARIAN = 'LIBRARIAN',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
  avatar?: string;
  department?: string;
  position?: string;
  phone?: string;
  status?: 'Active' | 'Inactive' | 'On Leave';
  joinDate?: Date;
  employeeId?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkPermission: (allowedRoles: UserRole[]) => boolean;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const initialState: AuthContextType = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  checkPermission: () => false,
  updateUserProfile: async () => {}
};

const AuthContext = createContext<AuthContextType>(initialState);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const convertSupabaseUserToUser = (supabaseUser: SupabaseUser, profile?: any): User => {
    return {
      id: supabaseUser.id,
      name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Unknown',
      email: supabaseUser.email || '',
      role: (profile?.role || supabaseUser.user_metadata?.role || UserRole.STUDENT) as UserRole,
      roles: [(profile?.role || supabaseUser.user_metadata?.role || UserRole.STUDENT) as UserRole],
      avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || '',
      department: profile?.department || supabaseUser.user_metadata?.department || '',
      position: profile?.position || '',
      phone: profile?.phone || '',
      status: (profile?.status || 'Active') as 'Active' | 'Inactive' | 'On Leave',
      joinDate: profile?.created_at ? new Date(profile.created_at) : new Date(),
      employeeId: profile?.employee_id || null,
    };
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetching to avoid potential deadlocks
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id);
            const userData = convertSupabaseUserToUser(session.user, profile);
            setUser(userData);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        fetchUserProfile(session.user.id).then((profile) => {
          const userData = convertSupabaseUserToUser(session.user, profile);
          setUser(userData);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return !!data.user;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      // State will be updated by the auth state change listener
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const checkPermission = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    
    // Check if the primary role is allowed
    if (allowedRoles.includes(user.role)) return true;
    
    // Check if any of the user's secondary roles are allowed
    if (user.roles && user.roles.some(role => allowedRoles.includes(role))) {
      return true;
    }
    
    return false;
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user || !session) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          department: userData.department,
          position: userData.position,
          phone: userData.phone,
          status: userData.status,
          employee_id: userData.employeeId,
          avatar_url: userData.avatar,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...userData } : null);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session?.user,
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

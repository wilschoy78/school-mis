import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/context/AuthContext';
import { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  position?: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  employee_id?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

const mapDatabaseToUserProfile = (data: any): UserProfile => {
  return {
    id: data.id,
    name: data.name || '',
    email: data.email || '',
    role: (data.role as UserRole) || UserRole.STUDENT,
    department: data.department,
    position: data.position,
    phone: data.phone,
    status: data.status as 'Active' | 'Inactive' || 'Active',
    employee_id: data.employee_id,
    avatar_url: data.avatar_url,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export const userService = {
  async getUsers(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return (data || []).map(mapDatabaseToUserProfile);
  },

  async createUser(userData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    const insertData: Omit<TablesInsert<'profiles'>, 'id' | 'created_at' | 'updated_at'> = {
      name: userData.name,
      email: userData.email,
      role: userData.role as string,
      department: userData.department,
      position: userData.position,
      phone: userData.phone,
      status: userData.status as string,
      employee_id: userData.employee_id,
      avatar_url: userData.avatar_url,
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return mapDatabaseToUserProfile(data);
  },

  async updateUser(id: string, userData: Partial<UserProfile>): Promise<UserProfile> {
    const updateData: TablesUpdate<'profiles'> = {
      name: userData.name,
      email: userData.email,
      role: userData.role as string,
      department: userData.department,
      position: userData.position,
      phone: userData.phone,
      status: userData.status as string,
      employee_id: userData.employee_id,
      avatar_url: userData.avatar_url,
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return mapDatabaseToUserProfile(data);
  },

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

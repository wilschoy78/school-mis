import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, UserRole, SortDirection, SortField } from '@/types';
import { userService } from '@/services/userService';

export const ITEMS_PER_PAGE = 5;

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async (page: number, roles: UserRole[] | 'all', search: string, sort: SortField, direction: SortDirection) => {
    try {
      setLoading(true);
      const { users: fetchedUsers, total } = await userService.getUsers(page, ITEMS_PER_PAGE, roles, search);
      setUsers(fetchedUsers);
      setTotalUsers(total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, 'all', searchTerm, sortField, sortDirection);
  }, [fetchUsers]);

  const getFullName = (user: User) => {
    return `${user.firstName} ${user.lastName}`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsAddDialogOpen(true);
  };

  const handlePasswordDialog = (user: User) => {
    setSelectedUser(user);
    setIsPasswordDialogOpen(true);
  };

  return {
    users,
    loading,
    error,
    paginatedUsers: users,
    currentPage,
    totalPages,
    totalUsers,
    sortField,
    sortDirection,
    searchTerm,
    isAddDialogOpen,
    isPasswordDialogOpen,
    selectedUser,
    setSearchTerm,
    setIsAddDialogOpen,
    setIsPasswordDialogOpen,
    setCurrentPage,
    onPageChange,
    handleSort,
    handleEdit,
    handlePasswordDialog,
    setSelectedUser,
    fetchUsers,
    getFullName
  };
};
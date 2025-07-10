import React from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Pencil, ArrowUpDown, ArrowUp, ArrowDown, 
} from 'lucide-react';
import DataPagination from '@/components/common/DataPagination';
import { User, SortDirection, SortField } from '@/types';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types';

interface UserTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  sortField: SortField;
  sortDirection: SortDirection;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onSort: (field: SortField) => void;
  onPasswordChange: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  currentPage,
  totalPages,
  sortField,
  sortDirection,
  onPageChange,
  onEdit,
  onSort,
  onPasswordChange
}) => {
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" /> 
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const getRoleBadge = (role: UserRole) => {
    const styles = {
      [UserRole.ADMIN]: "bg-purple-500",
      [UserRole.TEACHER]: "bg-blue-500",
      [UserRole.REGISTRAR]: "bg-green-500",
      [UserRole.LIBRARIAN]: "bg-teal-500",
      [UserRole.STUDENT]: "bg-gray-500",
      [UserRole.STAFF]: "bg-orange-500",
      [UserRole.PARENT]: "bg-pink-500",
    };

    return (
      <Badge className={styles[role]}>
        {role.replace('_', ' ')}
      </Badge>
    );
  };

  const getRolesByUser = (user: User) => {
    const roles = user.roles;
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role: UserRole) => (
          <span key={role}>{getRoleBadge(role)}</span>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableCaption>A list of all users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => onSort('firstName')}
              >
                <div className="flex items-center">
                  First Name
                  {renderSortIcon('firstName')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => onSort('lastName')}
              >
                <div className="flex items-center">
                  Last Name
                  {renderSortIcon('lastName')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => onSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {renderSortIcon('email')}
                </div>
              </TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRolesByUser(user)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onPasswordChange(user)}>
                      Change Password
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-center mt-4">
        <DataPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default UserTable;
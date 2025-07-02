import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Search, Pencil, Shield, User as UserIcon, Key, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole, User } from '@/types';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataPagination from '@/components/common/DataPagination';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { userService } from '@/services/userService';

const ITEMS_PER_PAGE = 5;

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  roles: UserRole[];
}

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  
  const form = useForm<UserForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: UserRole.STUDENT,
      roles: [UserRole.STUDENT],
    }
  });
  
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => {
    if (activeTab !== 'all' && activeTab !== user.role.toLowerCase()) {
      return false;
    }
    
    if (
      searchTerm &&
      !(user.firstName + ' ' + user.lastName).toLowerCase().includes(searchTerm.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const handleSubmit = async (data: UserForm) => {
    const roles = selectedRoles.length > 0 ? selectedRoles : [data.role];
    
    setLoading(true);
    try {
      if (selectedUser) {
        const updatedUser = {
          ...selectedUser,
          ...data,
          roles,
        };
        await userService.updateUser(updatedUser);
        toast({
          title: "User Updated",
          description: `${data.firstName} ${data.lastName}'s account has been updated.`
        });
      } else {
        const newUser = {
          ...data,
          roles,
        };
        await userService.addUser(newUser);
        toast({
          title: "User Created",
          description: `${data.firstName} ${data.lastName}'s account has been created.`
        });
      }
      await fetchUsers(); // Refresh data
    } catch (err) {
      setError('Failed to save user');
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to save user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setIsAddDialogOpen(false);
      setSelectedUser(null);
      setSelectedRoles([]);
      form.reset();
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles || [user.role]);
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      roles: user.roles || [user.role],
    });
    setIsAddDialogOpen(true);
  };

  const handleOpenDialog = () => {
    form.reset({
      firstName: '',
      lastName: '',
      email: '',
      role: UserRole.STUDENT,
      roles: [UserRole.STUDENT],
    });
    setSelectedRoles([UserRole.STUDENT]);
    setSelectedUser(null);
    setIsAddDialogOpen(true);
  };

  const toggleRole = (role: UserRole) => {
    setSelectedRoles(current => {
      if (current.includes(role)) {
        return current.filter(r => r !== role);
      } else {
        return [...current, role];
      }
    });
  };

  const removeRole = (role: UserRole) => {
    setSelectedRoles(current => current.filter(r => r !== role));
  };

  const getInitials = (user: User) => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const getRoleBadge = (role: UserRole) => {
    const styles = {
      [UserRole.SUPER_ADMIN]: "bg-red-500",
      [UserRole.ADMIN]: "bg-purple-500",
      [UserRole.TEACHER]: "bg-blue-500",
      [UserRole.REGISTRAR]: "bg-green-500",
      [UserRole.CASHIER]: "bg-yellow-500",
      [UserRole.LIBRARIAN]: "bg-teal-500",
      [UserRole.STUDENT]: "bg-gray-500"
    };
    
    return (
      <Badge className={styles[role]}>
        {role.replace('_', ' ')}
      </Badge>
    );
  };

  const getRolesByUser = (user: User) => {
    const roles = user.roles || [user.role];
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role: UserRole) => getRoleBadge(role))}
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <PageHeader 
          title="User Management" 
          description="Manage users, roles, and permissions"
        />
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <PageHeader 
          title="User Management" 
          description="Manage users, roles, and permissions"
        />
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader 
        title="User Management" 
        description="Manage users, roles, and permissions"
      />
      
      <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
            <TabsTrigger value="teacher">Teachers</TabsTrigger>
            <TabsTrigger value="student">Students</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogDescription>
                  {selectedUser ? 'Update user details and permissions' : 'Create a new user account'}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="user@school.edu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Role</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Add to selectedRoles if not already included
                            if (!selectedRoles.includes(value as UserRole)) {
                              setSelectedRoles(prev => [...prev, value as UserRole]);
                            }
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                            <SelectItem value={UserRole.TEACHER}>Teacher</SelectItem>
                            <SelectItem value={UserRole.REGISTRAR}>Registrar</SelectItem>
                            <SelectItem value={UserRole.CASHIER}>Cashier</SelectItem>
                            <SelectItem value={UserRole.LIBRARIAN}>Librarian</SelectItem>
                            <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Assigned Roles</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedRoles.map(role => (
                        <Badge key={role} className="flex items-center gap-1">
                          {role.replace('_', ' ')}
                          <button 
                            type="button" 
                            onClick={() => removeRole(role)}
                            className="ml-1 h-4 w-4 rounded-full bg-muted-foreground/20 flex items-center justify-center"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" type="button" size="sm">
                          Add Role
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Available Roles</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={selectedRoles.includes(UserRole.ADMIN)}
                          onCheckedChange={() => toggleRole(UserRole.ADMIN)}
                        >
                          Administrator
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={selectedRoles.includes(UserRole.TEACHER)}
                          onCheckedChange={() => toggleRole(UserRole.TEACHER)}
                        >
                          Teacher
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={selectedRoles.includes(UserRole.REGISTRAR)}
                          onCheckedChange={() => toggleRole(UserRole.REGISTRAR)}
                        >
                          Registrar
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={selectedRoles.includes(UserRole.CASHIER)}
                          onCheckedChange={() => toggleRole(UserRole.CASHIER)}
                        >
                          Cashier
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={selectedRoles.includes(UserRole.LIBRARIAN)}
                          onCheckedChange={() => toggleRole(UserRole.LIBRARIAN)}
                        >
                          Librarian
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={selectedRoles.includes(UserRole.STUDENT)}
                          onCheckedChange={() => toggleRole(UserRole.STUDENT)}
                        >
                          Student
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormItem>


                  <DialogFooter className="mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setSelectedUser(null);
                        setSelectedRoles([]);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">{selectedUser ? 'Update User' : 'Create User'}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <UsersTable 
            users={paginatedUsers} 
            handleEdit={handleEdit} 
            getInitials={getInitials}
            getRolesByUser={getRolesByUser}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
        <TabsContent value="admin" className="mt-0">
          <UsersTable 
            users={paginatedUsers} 
            handleEdit={handleEdit} 
            getInitials={getInitials}
            getRolesByUser={getRolesByUser}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
        <TabsContent value="teacher" className="mt-0">
          <UsersTable 
            users={paginatedUsers} 
            handleEdit={handleEdit} 
            getInitials={getInitials}
            getRolesByUser={getRolesByUser}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
        <TabsContent value="student" className="mt-0">
          <UsersTable 
            users={paginatedUsers} 
            handleEdit={handleEdit} 
            getInitials={getInitials}
            getRolesByUser={getRolesByUser}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
        <TabsContent value="staff" className="mt-0">
          <UsersTable 
            users={paginatedUsers} 
            handleEdit={handleEdit} 
            getInitials={getInitials}
            getRolesByUser={getRolesByUser}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

const UsersTable = ({ 
  users, 
  handleEdit, 
  getInitials, 
  getRolesByUser,
  currentPage,
  totalPages,
  onPageChange
}: {
  users: User[];
  handleEdit: (user: User) => void;
  getInitials: (user: User) => string;
  getRolesByUser: (user: User) => JSX.Element;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableCaption>List of system users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback>{getInitials(user)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRolesByUser(user)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
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

export default UsersPage;

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
  roles: UserRole[];
  department?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
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
      roles: [UserRole.STUDENT],
      department: '',
      status: 'active',
    }
  });
  
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const rolesToFetch = activeTab === 'all' ? 'all' : [activeTab as UserRole];
      const { users: fetchedUsers, total } = await userService.getUsers(
        currentPage,
        ITEMS_PER_PAGE,
        rolesToFetch,
        searchTerm,
      );
      setUsers(fetchedUsers);
      setTotalUsers(total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
  const paginatedUsers = users;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const handleSubmit = async (data: UserForm) => {
    const roles = selectedRoles.length > 0 ? selectedRoles : data.roles;
    
    setLoading(true);
    try {
      if (selectedUser) {
        const { ...updateData } = data;
const updatedUser = {
  ...updateData,
  roles,
  department: updateData.department,
  status: updateData.status,
};
        await userService.updateUser(selectedUser.id, updatedUser);
        toast({
          title: "User Updated",
          description: `${data.firstName} ${data.lastName}'s account has been updated.`
        });
      } else {
        const newUser = {
          ...data,
          roles,
          department: data.department,
          status: data.status,
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
    setSelectedRoles(user.roles);
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
      department: user.department || '',
      status: user.status || 'active',
    });
    setIsAddDialogOpen(true);
  };

  const handleOpenDialog = () => {
    form.reset({
      firstName: '',
      lastName: '',
      email: '',
      roles: [UserRole.STUDENT],
      department: '',
      status: 'active',
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
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Administration">Administration</SelectItem>
                            <SelectItem value="Academics">Academics</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                            <SelectItem value="Library">Library</SelectItem>
                            <SelectItem value="Student Affairs">Student Affairs</SelectItem>
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
                        <DropdownMenuCheckboxItem
                          checked={selectedRoles.includes(UserRole.STAFF)}
                          onCheckedChange={() => toggleRole(UserRole.STAFF)}
                        >
                          Staff
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={selectedRoles.includes(UserRole.PARENT)}
                          onCheckedChange={() => toggleRole(UserRole.PARENT)}
                        >
                          Parent
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Account Status</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="active" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Active
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="inactive" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Inactive
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="suspended" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Suspended
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
            onPageChange={onPageChange}
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
            onPageChange={onPageChange}
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
            onPageChange={onPageChange}
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
            onPageChange={onPageChange}
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
            onPageChange={onPageChange}
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
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
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
                  <TableCell>{user.department || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                      {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'N/A'}
                    </Badge>
                  </TableCell>
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

export default UsersPage;

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
import ErrorPage from './ErrorPage';
import { userService } from '@/services/userService';

const ITEMS_PER_PAGE = 5;

interface UserForm {
  firstName: string;
  lastName:string;
  email: string;
  roles: UserRole[];
  department?: string;
  status?: 'active' | 'inactive' | 'suspended';
  password?: string;
}

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);

  const passwordForm = useForm<{ password: ''}>({
    defaultValues: {
      password: '',
    }
  });

  const form = useForm<UserForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      roles: [UserRole.STAFF],
      department: '',
      status: 'inactive',
      password: '',
    }
  });

  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const rolesToFetch = activeTab === 'all' ? 'all' : [activeTab as UserRole];
      const { users: fetchedUsers, total } = await userService.getUsers(
        currentPage,
        ITEMS_PER_PAGE,
        rolesToFetch,
        debouncedSearchTerm,
      );
      setUsers(fetchedUsers);
      setTotalUsers(total);
      setError(null);
    } catch (err) {
      setError({ title: 'Fetch Error', message: 'Failed to fetch users' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [activeTab, currentPage, debouncedSearchTerm]);

  useEffect(() => {
    form.setValue('roles', selectedRoles);
  }, [selectedRoles, form]);

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
  const paginatedUsers = users;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, activeTab]);

  const handleSubmit = async (data: UserForm) => {
    setLoading(true);
    try {
      if (selectedUser) {
        const { password, ...updateData } = data;
        const updatedUser = {
          ...updateData,
          roles: data.roles,
          department: updateData.department,
          status: updateData.status,
        };
        await userService.updateUser(selectedUser.id, updatedUser);
        toast({
          title: 'User Updated',
          description: `${data.firstName} ${data.lastName}'s account has been updated.`
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...newUser } = {
          ...data,
          roles: data.roles,
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
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setError({
          title: 'User Creation Failed',
          message: 'A user with this email already exists. Please use a different email.',
        });
      } else {
        setError({
          title: 'Error',
          message: 'Failed to save user. Please try again later.',
        });
      }
      console.error(err);
    } finally {
      setLoading(false);
      setIsAddDialogOpen(false);
      setSelectedUser(null);
      setSelectedRoles([]);
      form.reset();
    }
  };

  const handlePasswordSubmit = async (data: {password: string}) => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      await userService.updatePassword(parseInt(selectedUser.id, 10), data.password);
      toast({
        title: 'Password Updated',
        description: `The password for ${selectedUser.firstName} ${selectedUser.lastName} has been updated.`,
      });
      await fetchUsers();
    } catch (err) {
      setError({
        title: 'Error',
        message: 'Failed to update password. Please try again later.',
      });
      console.error(err);
    } finally {
      setLoading(false);
      setIsPasswordDialogOpen(false);
      setSelectedUser(null);
      passwordForm.reset();
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
      roles: [UserRole.STAFF],
      department: '',
      status: 'inactive',
      password: '',
    });
    setSelectedRoles([UserRole.STAFF]);
    setSelectedUser(null);
    setIsAddDialogOpen(true);
  };

  const handlePasswordDialog = (user: User) => {
    setSelectedUser(user);
    setIsPasswordDialogOpen(true);
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
    return <ErrorPage title={error.title} message={error.message} />;
  }

  return (
    <MainLayout>
      <PageHeader
        title="User Management"
        description="Manage users, roles, and permissions"
      />

      <Tabs value={activeTab} className="w-full mb-6" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.values(UserRole).filter(role => ![UserRole.SUPER_ADMIN, UserRole.PARENT, UserRole.CASHIER, UserRole.REGISTRAR, UserRole.LIBRARIAN].includes(role)).map(role => (
              <TabsTrigger key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
              </TabsTrigger>
            ))}
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

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            Total Users: {totalUsers}
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
            handlePasswordDialog={handlePasswordDialog}
          />
        </TabsContent>
        {Object.values(UserRole).filter(role => ![UserRole.SUPER_ADMIN, UserRole.PARENT, UserRole.CASHIER, UserRole.REGISTRAR, UserRole.LIBRARIAN].includes(role)).map(role => (
          <TabsContent key={role} value={role} className="mt-0">
            <UsersTable
              users={paginatedUsers}
              handleEdit={handleEdit}
              getInitials={getInitials}
              getRolesByUser={getRolesByUser}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              handlePasswordDialog={handlePasswordDialog}
            />
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter a new password for {selectedUser?.firstName}{' '}
              {selectedUser?.lastName}.
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPasswordDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Password</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

const UsersTable = ({
  users,
  handleEdit,
  getInitials,
  getRolesByUser,
  handlePasswordDialog,
  currentPage,
  totalPages,
  onPageChange
}: {
  users: User[];
  handleEdit: (user: User) => void;
  getInitials: (user: User) => string;
  getRolesByUser: (user: User) => JSX.Element;
  handlePasswordDialog: (user: User) => void;
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
                      <Button variant="ghost" size="sm" onClick={() => handlePasswordDialog(user)}>
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

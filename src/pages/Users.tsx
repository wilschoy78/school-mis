
import React, { useState, useEffect } from 'react';
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
import { PlusCircle, Search, Pencil, Shield, User, Key, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/context/AuthContext';
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

const initialUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@school.edu',
    role: UserRole.ADMIN,
    roles: [UserRole.ADMIN, UserRole.TEACHER],
    department: 'Administration',
    status: 'Active',
    lastLogin: new Date(2023, 7, 15, 10, 30),
    avatar: ''
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    role: UserRole.TEACHER,
    roles: [UserRole.TEACHER],
    department: 'Science',
    status: 'Active',
    lastLogin: new Date(2023, 7, 14, 14, 45),
    avatar: ''
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@school.edu',
    role: UserRole.REGISTRAR,
    department: 'Administration',
    status: 'Active',
    lastLogin: new Date(2023, 7, 15, 9, 15),
    avatar: ''
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@school.edu',
    role: UserRole.LIBRARIAN,
    department: 'Library',
    status: 'Inactive',
    lastLogin: new Date(2023, 6, 30, 11, 20),
    avatar: ''
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@school.edu',
    role: UserRole.TEACHER,
    department: 'Mathematics',
    status: 'Active',
    lastLogin: new Date(2023, 7, 12, 15, 10),
    avatar: ''
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@school.edu',
    role: UserRole.STUDENT,
    department: 'Grade 10',
    status: 'Active',
    lastLogin: new Date(2023, 7, 14, 16, 30),
    avatar: ''
  },
  {
    id: '7',
    name: 'Mark Johnson',
    email: 'mark.johnson@school.edu',
    role: UserRole.TEACHER,
    department: 'Physical Education',
    status: 'Active',
    lastLogin: new Date(2023, 7, 13, 10, 45),
    avatar: ''
  },
  {
    id: '8',
    name: 'Susan Williams',
    email: 'susan.williams@school.edu',
    role: UserRole.CASHIER,
    department: 'Administration',
    status: 'Active',
    lastLogin: new Date(2023, 7, 14, 8, 15),
    avatar: ''
  },
  {
    id: '9',
    name: 'Kevin Harris',
    email: 'kevin.harris@school.edu',
    role: UserRole.REGISTRAR,
    department: 'Administration',
    status: 'Active',
    lastLogin: new Date(2023, 7, 12, 14, 30),
    avatar: ''
  },
  {
    id: '10',
    name: 'Emma Garcia',
    email: 'emma.garcia@school.edu',
    role: UserRole.STUDENT,
    department: 'Grade 11',
    status: 'Inactive',
    lastLogin: new Date(2023, 6, 25, 16, 10),
    avatar: ''
  }
];

const ITEMS_PER_PAGE = 5;

interface UserForm {
  name: string;
  email: string;
  role: UserRole;
  roles: UserRole[];
  department: string;
  status: 'Active' | 'Inactive';
}

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  
  const form = useForm<UserForm>({
    defaultValues: {
      name: '',
      email: '',
      role: UserRole.STUDENT,
      roles: [UserRole.STUDENT],
      department: '',
      status: 'Active'
    }
  });
  
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    if (activeTab !== 'all' && activeTab !== user.role.toLowerCase()) {
      return false;
    }
    
    if (
      searchTerm &&
      !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !user.department.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSubmit = (data: UserForm) => {
    const roles = selectedRoles.length > 0 ? selectedRoles : [data.role];
    
    if (selectedUser) {
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { 
          ...selectedUser, 
          ...data,
          roles
        } : user
      );
      setUsers(updatedUsers);
      toast({
        title: "User Updated",
        description: `${data.name}'s account has been updated.`
      });
    } else {
      const newUser = {
        id: (users.length + 1).toString(),
        ...data,
        roles,
        lastLogin: null,
        avatar: ''
      };
      setUsers([...users, newUser]);
      toast({
        title: "User Created",
        description: `${data.name}'s account has been created.`
      });
    }
    
    setIsAddDialogOpen(false);
    setSelectedUser(null);
    setSelectedRoles([]);
    form.reset();
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles || [user.role]);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      roles: user.roles || [user.role],
      department: user.department,
      status: user.status as 'Active' | 'Inactive'
    });
    setIsAddDialogOpen(true);
  };

  const handleOpenDialog = () => {
    form.reset({
      name: '',
      email: '',
      role: UserRole.STUDENT,
      roles: [UserRole.STUDENT],
      department: '',
      status: 'Active'
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
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

  const getRolesByUser = (user: any) => {
    const roles = user.roles || [user.role];
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role: UserRole) => getRoleBadge(role))}
      </div>
    );
  };

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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
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

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Department or class" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Active" id="r1" />
                              <label htmlFor="r1">Active</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Inactive" id="r2" />
                              <label htmlFor="r2">Inactive</label>
                            </div>
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
              <TableHead>Last Login</TableHead>
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
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRolesByUser(user)}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      <span className="text-sm">
                        {new Date(user.lastLogin).toLocaleDateString()} at {new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Never</span>
                    )}
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
                <TableCell colSpan={6} className="text-center py-6">
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

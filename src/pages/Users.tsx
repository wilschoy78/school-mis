
import React, { useState } from 'react';
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
import { PlusCircle, Search, Pencil, Shield, User, Key } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock user data
const initialUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@school.edu',
    role: UserRole.ADMIN,
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
  }
];

interface UserForm {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'Active' | 'Inactive';
}

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const form = useForm<UserForm>({
    defaultValues: {
      name: '',
      email: '',
      role: UserRole.STUDENT,
      department: '',
      status: 'Active'
    }
  });
  
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    // Filter by tab
    if (activeTab !== 'all' && activeTab !== user.role.toLowerCase()) {
      return false;
    }
    
    // Filter by search
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

  const handleSubmit = (data: UserForm) => {
    if (selectedUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...selectedUser, ...data } : user
      );
      setUsers(updatedUsers);
      toast({
        title: "User Updated",
        description: `${data.name}'s account has been updated.`
      });
    } else {
      // Add new user
      const newUser = {
        id: (users.length + 1).toString(),
        ...data,
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
    form.reset();
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
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
      department: '',
      status: 'Active'
    });
    setSelectedUser(null);
    setIsAddDialogOpen(true);
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
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            users={filteredUsers} 
            handleEdit={handleEdit} 
            getInitials={getInitials}
            getRoleBadge={getRoleBadge}
          />
        </TabsContent>
        <TabsContent value="admin" className="mt-0">
          <UsersTable 
            users={filteredUsers} 
            handleEdit={handleEdit} 
            getInitials={getInitials}
            getRoleBadge={getRoleBadge}
          />
        </TabsContent>
        <TabsContent value="teacher" className="mt-0">
          <UsersTable 
            users={filteredUsers} 
            handleEdit={handleEdit} 
            getInitials={getInitials}
            getRoleBadge={getRoleBadge}
          />
        </TabsContent>
        <TabsContent value="student" className="mt-0">
          <UsersTable 
            users={filteredUsers} 
            handleEdit={handleEdit} 
            getInitials={getInitials}
            getRoleBadge={getRoleBadge}
          />
        </TabsContent>
        <TabsContent value="staff" className="mt-0">
          <UsersTable 
            users={filteredUsers} 
            handleEdit={handleEdit} 
            getInitials={getInitials}
            getRoleBadge={getRoleBadge}
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

const UsersTable = ({ users, handleEdit, getInitials, getRoleBadge }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableCaption>List of system users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
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
                <TableCell>{getRoleBadge(user.role)}</TableCell>
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
  );
};

export default UsersPage;

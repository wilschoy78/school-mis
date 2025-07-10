import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { UserRole, RegisterFormData } from "@/types/auth";
import { userService } from "@/services/userService";
import { toast } from "@/components/ui/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";
import DataPagination from "@/components/common/DataPagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserManagement } from "@/hooks/useUserManagement";
import UserTable from "@/components/users/UserTable";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  department: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended"]),
});

const passwordFormSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

const UsersPage = () => {
  const {
    paginatedUsers,
    totalUsers,
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isPasswordDialogOpen,
    setIsPasswordDialogOpen,
    selectedUser,
    setSelectedUser,
    handleSort,
    onPageChange,
    handleEdit: openEditDialog,
    handlePasswordDialog: openPasswordDialog,
    getFullName,
    fetchUsers
  } = useUserManagement();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      status: "active",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    const rolesToFetch = activeTab === 'all' ? 'all' : [activeTab as UserRole];
    fetchUsers(currentPage, rolesToFetch, searchTerm, sortField, sortDirection);
  }, [activeTab, currentPage, searchTerm, sortField, sortDirection, fetchUsers]);

  const handleEdit = (user) => {
    openEditDialog(user);
    setSelectedRoles(user.roles);
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      department: user.department || "",
      status: user.status,
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userData = {
        ...values,
        roles: selectedRoles,
        email: values.email,
      };
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, userData);
        toast({ title: "User updated successfully" });
      } else {
        await userService.addUser({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          department: values.department,
          status: values.status,
          roles: selectedRoles,
        });
        toast({ title: "User created successfully" });
      }
      const rolesToFetch = activeTab === 'all' ? 'all' : [activeTab as UserRole];
      fetchUsers(1, rolesToFetch, "", sortField, sortDirection);
      setIsAddDialogOpen(false);
      setSelectedUser(null);
      setSelectedRoles([]);
      form.reset();
    } catch (error) {
      toast({ title: "Error submitting form", description: "Please try again.", variant: "destructive" });
    }
  };

  const handlePasswordSubmit = async (values: z.infer<typeof passwordFormSchema>) => {
    if (!selectedUser) return;
    try {
      await userService.updatePassword(parseInt(selectedUser.id, 10), values.password);
      toast({ title: "Password updated successfully" });
      setIsPasswordDialogOpen(false);
      passwordForm.reset();
    } catch (error) {
      toast({ title: "Error updating password", description: "Please try again.", variant: "destructive" });
    }
  };

  const toggleRole = (role: UserRole) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const removeRole = (role: UserRole) => {
    setSelectedRoles(prev => prev.filter(r => r !== role));
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.values(UserRole).filter(role => ![UserRole.SUPER_ADMIN, UserRole.PARENT, UserRole.CASHIER, UserRole.REGISTRAR, UserRole.LIBRARIAN].includes(role)).map(role => (
              <TabsTrigger key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1).toLowerCase().replace('_', ' ')}</TabsTrigger>
            ))}
          </TabsList>
          <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
            setIsAddDialogOpen(isOpen);
            if (!isOpen) {
              setSelectedUser(null);
              setSelectedRoles([]);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setSelectedUser(null);
                setSelectedRoles([]);
                form.reset();
                setIsAddDialogOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogDescription>
                  {selectedUser ? 'Update the details of the existing user.' : 'Fill in the form to create a new user.'}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <UserTable
            users={paginatedUsers}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            onPageChange={onPageChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onEdit={handleEdit}
            onPasswordChange={openPasswordDialog}
          />
        </TabsContent>
        {Object.values(UserRole).filter(role => ![UserRole.SUPER_ADMIN, UserRole.PARENT, UserRole.CASHIER, UserRole.REGISTRAR, UserRole.LIBRARIAN].includes(role)).map(role => (
          <TabsContent key={role} value={role} className="mt-0">
            <UserTable
              users={paginatedUsers}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              onPageChange={onPageChange}
              currentPage={currentPage}
              totalPages={totalPages}
              onEdit={handleEdit}
              onPasswordChange={openPasswordDialog}
            />
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter a new password for {selectedUser ? getFullName(selectedUser) : ''}.
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
export default UsersPage;

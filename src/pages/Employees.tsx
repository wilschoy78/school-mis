import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  PlusCircle,
  Search,
  Users,
  Building,
  UserCheck,
  Settings,
  Mail,
  Phone,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useEmployeeManagement } from '@/hooks/useEmployeeManagement';
import { User, UserRole } from '@/types/auth';
import { EmployeeFormData } from '@/types/employee';
import { Textarea } from '@/components/ui/textarea';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import DataPagination from '@/components/common/DataPagination';

const EmployeesPage = () => {
  const {
    // Employee data
    employees,
    totalEmployees,
    employeeStats,
    isEmployeesLoading,
    employeesError,
    
    // Position and Department data
    positions,
    departments,
    
    // Pagination and filters
    currentPage,
    totalPages,
    searchTerm,
    selectedDepartment,
    selectedPosition,
    
    // Dialog states
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isPositionDialogOpen,
    setIsPositionDialogOpen,
    isDepartmentDialogOpen,
    setIsDepartmentDialogOpen,
    selectedEmployee,
    
    // Handlers
    handleAddEmployee,
    handleEditEmployee,
    handleAddPosition,
    handleEditPosition,
    handleAddDepartment,
    handleEditDepartment,
    openEditDialog,
    openPositionEditDialog,
    openDepartmentEditDialog,
    handlePageChange,
    handleSearch,
    handleDepartmentFilter,
    handlePositionFilter,
  } = useEmployeeManagement();

  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    roles: ['staff'],
    department: '',
    position: '',
    employeeId: '',
    hireDate: '',
    salary: undefined,
    emergencyContact: '',
    emergencyPhone: '',
    address: '',
    dateOfBirth: '',
    status: 'active',
  });
  
  const [positionFormData, setPositionFormData] = useState({
    name: '',
    description: '',
    category: 'administrative' as const,
  });
  
  const [departmentFormData, setDepartmentFormData] = useState({
    name: '',
    description: '',
    category: 'academic' as const,
  });

  // Reset form data when dialogs close
  const resetFormData = () => {
    setFormData({
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
      roles: ['staff'],
      department: '',
      position: '',
      employeeId: '',
      hireDate: '',
      salary: undefined,
      emergencyContact: '',
      emergencyPhone: '',
      address: '',
      dateOfBirth: '',
      status: 'active',
    });
  };

  const resetPositionFormData = () => {
    setPositionFormData({
      name: '',
      description: '',
      category: 'administrative',
    });
  };

  const resetDepartmentFormData = () => {
    setDepartmentFormData({
      name: '',
      description: '',
      category: 'academic',
    });
  };

  // Form submission handlers
  const handleSubmitEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedEmployee) {
        await handleEditEmployee(formData);
      } else {
        await handleAddEmployee(formData);
      }
      resetFormData();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleSubmitPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleAddPosition(positionFormData);
      resetPositionFormData();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleSubmitDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleAddDepartment(departmentFormData);
      resetDepartmentFormData();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Open edit dialog with pre-filled data
  const handleEditClick = (employee: User) => {
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      middleName: employee.middleName || '',
      email: employee.email,
      phone: employee.phone || '',
      roles: employee.roles,
      department: employee.department || '',
      position: employee.position || '',
      employeeId: employee.employeeId || '',
      hireDate: employee.hireDate || '',
      salary: employee.salary,
      emergencyContact: employee.emergencyContact || '',
      emergencyPhone: employee.emergencyPhone || '',
      address: employee.address || '',
      dateOfBirth: employee.dateOfBirth || '',
      status: employee.status || 'active',
    });
    openEditDialog(employee);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-500">Active</Badge>;
    } else if (status === 'on_leave') {
      return <Badge className="bg-yellow-500">On Leave</Badge>;
    } else {
      return <Badge className="bg-red-500">Inactive</Badge>;
    }
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Employees" 
        description="Manage teachers and staff members"
      />
      
      <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Employees</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="staff">Administrative Staff</TabsTrigger>
          </TabsList>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{selectedEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
                <DialogDescription>
                  Enter the employee details below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitEmployee} className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleInputChange} 
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange} 
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input 
                    id="middleName" 
                    name="middleName" 
                    value={formData.middleName} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input 
                    id="employeeId" 
                    name="employeeId" 
                    value={formData.employeeId} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Select 
                    value={formData.position} 
                    onValueChange={(value) => handleSelectChange('position', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position.id.toString()} value={position.id.toString()}>
                          {position.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => handleSelectChange('department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hireDate">Hire Date</Label>
                  <Input 
                    id="hireDate" 
                    name="hireDate" 
                    type="date"
                    value={formData.hireDate} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Salary</Label>
                  <Input 
                    id="salary" 
                    name="salary" 
                    type="number"
                    value={formData.salary || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  resetFormData();
                }}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSubmitEmployee}>
                  {selectedEmployee ? 'Update' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search employees..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <EmployeeTable 
            employees={employees}
            handleEdit={handleEditClick}
            getInitials={getInitials}
            getStatusBadge={getStatusBadge}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </TabsContent>
        <TabsContent value="teachers" className="mt-0">
          <EmployeeTable 
            employees={employees.filter(emp => emp.roles.includes('TEACHER' as UserRole))}
            handleEdit={handleEditClick} 
            getInitials={getInitials}
            getStatusBadge={getStatusBadge}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </TabsContent>
        <TabsContent value="staff" className="mt-0">
          <EmployeeTable 
            employees={employees.filter(emp => emp.roles.includes('STAFF' as UserRole))}
            handleEdit={handleEditClick} 
            getInitials={getInitials}
            getStatusBadge={getStatusBadge}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

const EmployeeTable = ({ 
  employees, 
  handleEdit, 
  getInitials, 
  getStatusBadge,
  currentPage,
  totalPages,
  onPageChange
}: {
  employees: User[];
  handleEdit: (employee: User) => void;
  getInitials: (firstName: string, lastName: string) => string;
  getStatusBadge: (status: string) => JSX.Element;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableCaption>List of employees</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Joining Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
                        <AvatarFallback>{getInitials(employee.firstName, employee.lastName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{employee.email}</span>
                      </div>
                      {employee.phone && (
                        <div className="flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">{employee.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{employee.hireDate}</TableCell>
                  <TableCell>{getStatusBadge(employee.status || 'active')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(employee)}>
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No employees found</TableCell>
              </TableRow>
            )}
          </TableBody>
       </Table>
       
       <DataPagination
         currentPage={currentPage}
         totalPages={totalPages}
         onPageChange={onPageChange}
       />
     </div>
   </div>
 );
};
export default EmployeesPage;

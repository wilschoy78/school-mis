
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Search, Pencil, Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import DataPagination from '@/components/common/DataPagination';

const employeesData = [
  { 
    id: '1', 
    firstName: 'John',
    middleName: '',
    lastName: 'Smith',
    suffix: '',
    email: 'john.smith@school.edu', 
    phone: '555-1234',
    position: 'Math Teacher', 
    department: 'Mathematics',
    joiningDate: new Date(2020, 5, 15),
    status: 'Active',
    avatar: ''
  },
  { 
    id: '2', 
    firstName: 'Sarah',
    middleName: '',
    lastName: 'Johnson',
    suffix: '',
    email: 'sarah.johnson@school.edu', 
    phone: '555-5678',
    position: 'Science Teacher', 
    department: 'Science',
    joiningDate: new Date(2019, 8, 10),
    status: 'Active',
    avatar: ''
  },
  { 
    id: '3', 
    firstName: 'Michael',
    middleName: '',
    lastName: 'Brown',
    suffix: '',
    email: 'michael.brown@school.edu', 
    phone: '555-9012',
    position: 'Principal', 
    department: 'Administration',
    joiningDate: new Date(2018, 2, 22),
    status: 'Active',
    avatar: ''
  },
  { 
    id: '4', 
    firstName: 'Emily',
    middleName: '',
    lastName: 'Davis',
    suffix: '',
    email: 'emily.davis@school.edu', 
    phone: '555-3456',
    position: 'Librarian', 
    department: 'Library',
    joiningDate: new Date(2021, 1, 5),
    status: 'On Leave',
    avatar: ''
  },
  { 
    id: '5', 
    firstName: 'Robert',
    middleName: '',
    lastName: 'Wilson',
    suffix: '',
    email: 'robert.wilson@school.edu', 
    phone: '555-7890',
    position: 'English Teacher', 
    department: 'Languages',
    joiningDate: new Date(2022, 7, 18),
    status: 'Active',
    avatar: ''
  },
  { 
    id: '6', 
    firstName: 'Jennifer',
    middleName: '',
    lastName: 'Thomas',
    suffix: '',
    email: 'jennifer.thomas@school.edu', 
    phone: '555-5432',
    position: 'Physical Education Teacher', 
    department: 'Physical Education',
    joiningDate: new Date(2021, 6, 5),
    status: 'Active',
    avatar: ''
  },
  { 
    id: '7', 
    firstName: 'Daniel',
    middleName: '',
    lastName: 'Harris',
    suffix: '',
    email: 'daniel.harris@school.edu', 
    phone: '555-8765',
    position: 'IT Coordinator', 
    department: 'Administration',
    joiningDate: new Date(2020, 3, 12),
    status: 'Active',
    avatar: ''
  },
  { 
    id: '8', 
    firstName: 'Melissa',
    middleName: '',
    lastName: 'Garcia',
    suffix: '',
    email: 'melissa.garcia@school.edu', 
    phone: '555-9876',
    position: 'Counselor', 
    department: 'Counseling',
    joiningDate: new Date(2022, 1, 15),
    status: 'On Leave',
    avatar: ''
  },
];

const ITEMS_PER_PAGE = 5;

const EmployeesPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState(employeesData);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    status: 'Active',
  });
  const { toast } = useToast();

  let displayedEmployees = employees;
  if (activeTab === 'teachers') {
    displayedEmployees = employees.filter(emp => emp.position.includes('Teacher'));
  } else if (activeTab === 'staff') {
    displayedEmployees = employees.filter(emp => !emp.position.includes('Teacher'));
  }

  const filteredEmployees = displayedEmployees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.middleName} ${employee.lastName} ${employee.suffix}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.position || !formData.department) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (selectedEmployee) {
      const updatedEmployees = employees.map(employee => 
        employee.id === selectedEmployee.id 
          ? { 
              ...employee, 
              ...formData,
              joiningDate: employee.joiningDate,
              avatar: employee.avatar
            } 
          : employee
      );
      setEmployees(updatedEmployees);
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
    } else {
      const newEmployee = {
        id: (employees.length + 1).toString(),
        ...formData,
        joiningDate: new Date(),
        avatar: ''
      };
      setEmployees([...employees, newEmployee]);
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
    }
    
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      status: 'Active',
    });
    setSelectedEmployee(null);
    setIsAddDialogOpen(false);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      middleName: employee.middleName,
      lastName: employee.lastName,
      suffix: employee.suffix,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      status: employee.status,
    });
    setIsAddDialogOpen(true);
  };

  const getInitials = (employee) => {
    return `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase();
  };

  const getFullName = (employee) => {
    let fullName = `${employee.firstName}`;
    if (employee.middleName) fullName += ` ${employee.middleName}`;
    fullName += ` ${employee.lastName}`;
    if (employee.suffix) fullName += ` ${employee.suffix}`;
    return fullName;
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return <Badge className="bg-green-500">Active</Badge>;
    } else if (status === 'On Leave') {
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">First Name*</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleInputChange} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="middleName" className="text-right">Middle Name</Label>
                    <Input 
                      id="middleName" 
                      name="middleName" 
                      value={formData.middleName} 
                      onChange={handleInputChange} 
                      className="col-span-3" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastName" className="text-right">Last Name*</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="suffix" className="text-right">Suffix</Label>
                    <Input 
                      id="suffix" 
                      name="suffix" 
                      value={formData.suffix} 
                      onChange={handleInputChange} 
                      className="col-span-3" 
                      placeholder="Jr., Sr., III, etc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email*</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleInputChange} 
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">Position*</Label>
                  <Select 
                    value={formData.position} 
                    onValueChange={(value) => handleSelectChange('position', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Math Teacher">Math Teacher</SelectItem>
                      <SelectItem value="Science Teacher">Science Teacher</SelectItem>
                      <SelectItem value="English Teacher">English Teacher</SelectItem>
                      <SelectItem value="History Teacher">History Teacher</SelectItem>
                      <SelectItem value="Art Teacher">Art Teacher</SelectItem>
                      <SelectItem value="Principal">Principal</SelectItem>
                      <SelectItem value="Vice Principal">Vice Principal</SelectItem>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                      <SelectItem value="Librarian">Librarian</SelectItem>
                      <SelectItem value="Counselor">Counselor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">Department*</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => handleSelectChange('department', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Languages">Languages</SelectItem>
                      <SelectItem value="Social Studies">Social Studies</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Library">Library</SelectItem>
                      <SelectItem value="Counseling">Counseling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  setSelectedEmployee(null);
                  setFormData({
                    firstName: '',
                    middleName: '',
                    lastName: '',
                    suffix: '',
                    email: '',
                    phone: '',
                    position: '',
                    department: '',
                    status: 'Active',
                  });
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddEmployee}>Save</Button>
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <EmployeeTable 
            employees={paginatedEmployees} 
            handleEdit={handleEditEmployee} 
            getInitials={getInitials}
            getStatusBadge={getStatusBadge}
            getFullName={getFullName}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
        <TabsContent value="teachers" className="mt-0">
          <EmployeeTable 
            employees={paginatedEmployees} 
            handleEdit={handleEditEmployee} 
            getInitials={getInitials}
            getStatusBadge={getStatusBadge}
            getFullName={getFullName}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
        <TabsContent value="staff" className="mt-0">
          <EmployeeTable 
            employees={paginatedEmployees} 
            handleEdit={handleEditEmployee} 
            getInitials={getInitials}
            getStatusBadge={getStatusBadge}
            getFullName={getFullName}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
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
  getFullName,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <>
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
                        <AvatarImage src={employee.avatar} alt={getFullName(employee)} />
                        <AvatarFallback>{getInitials(employee)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{getFullName(employee)}</p>
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
                      <div className="flex items-center mt-1">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{employee.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{format(employee.joiningDate, 'MMM d, yyyy')}</TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(employee)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No employees found
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

export default EmployeesPage;

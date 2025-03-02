
import React, { useState } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  GraduationCap,
  Search,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText,
  Edit,
  Eye,
  Trash,
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

// Define mock data for students
const mockStudents = [
  { 
    id: '1', 
    name: 'John Smith', 
    studentId: 'S2023001', 
    grade: '12',
    gender: 'Male',
    contactNo: '(555) 123-4567',
    email: 'john.smith@example.com',
    guardian: 'Mary Smith',
    status: 'Enrolled',
    balance: 450,
  },
  { 
    id: '2', 
    name: 'Maria Garcia', 
    studentId: 'S2023002', 
    grade: '10',
    gender: 'Female',
    contactNo: '(555) 234-5678',
    email: 'maria.garcia@example.com',
    guardian: 'Carlos Garcia',
    status: 'Enrolled',
    balance: 0,
  },
  { 
    id: '3', 
    name: 'James Johnson', 
    studentId: 'S2023003', 
    grade: '11',
    gender: 'Male',
    contactNo: '(555) 345-6789',
    email: 'james.johnson@example.com',
    guardian: 'Patricia Johnson',
    status: 'Enrolled',
    balance: 850,
  },
  { 
    id: '4', 
    name: 'Emily Davis', 
    studentId: 'S2023004', 
    grade: '9',
    gender: 'Female',
    contactNo: '(555) 456-7890',
    email: 'emily.davis@example.com',
    guardian: 'Robert Davis',
    status: 'Transferee',
    balance: 1200,
  },
  { 
    id: '5', 
    name: 'Michael Wilson', 
    studentId: 'S2023005', 
    grade: '12',
    gender: 'Male',
    contactNo: '(555) 567-8901',
    email: 'michael.wilson@example.com',
    guardian: 'Susan Wilson',
    status: 'Enrolled',
    balance: 300,
  },
  { 
    id: '6', 
    name: 'Sofia Martinez', 
    studentId: 'S2023006', 
    grade: '10',
    gender: 'Female',
    contactNo: '(555) 678-9012',
    email: 'sofia.martinez@example.com',
    guardian: 'Juan Martinez',
    status: 'Pending',
    balance: 750,
  },
  { 
    id: '7', 
    name: 'Daniel Thompson', 
    studentId: 'S2023007', 
    grade: '9',
    gender: 'Male',
    contactNo: '(555) 789-0123',
    email: 'daniel.thompson@example.com',
    guardian: 'Elizabeth Thompson',
    status: 'Enrolled',
    balance: 0,
  },
  { 
    id: '8', 
    name: 'Olivia Johnson', 
    studentId: 'S2023008', 
    grade: '11',
    gender: 'Female',
    contactNo: '(555) 890-1234',
    email: 'olivia.johnson@example.com',
    guardian: 'David Johnson',
    status: 'Enrolled',
    balance: 550,
  },
  { 
    id: '9', 
    name: 'William Brown', 
    studentId: 'S2023009', 
    grade: '10',
    gender: 'Male',
    contactNo: '(555) 901-2345',
    email: 'william.brown@example.com',
    guardian: 'Jennifer Brown',
    status: 'Transferee',
    balance: 900,
  },
  { 
    id: '10', 
    name: 'Emma White', 
    studentId: 'S2023010', 
    grade: '12',
    gender: 'Female',
    contactNo: '(555) 012-3456',
    email: 'emma.white@example.com',
    guardian: 'Michael White',
    status: 'Enrolled',
    balance: 150,
  },
];

// Function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

const Students = () => {
  const { checkPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  
  const itemsPerPage = 8;
  
  // Filter students based on search query and filters
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    
    return matchesSearch && matchesStatus && matchesGrade;
  });
  
  // Paginate students
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle checkbox selection
  const handleSelectAll = () => {
    if (selectedStudents.length === paginatedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(paginatedStudents.map(student => student.id));
    }
  };
  
  const handleSelectOne = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };
  
  // For new student form
  const form = useForm({
    defaultValues: {
      name: '',
      grade: '',
      gender: '',
      contactNo: '',
      email: '',
      guardian: '',
    },
  });
  
  const onSubmit = (data: any) => {
    console.log(data);
    toast({
      title: 'Student added',
      description: `${data.name} has been successfully added.`,
    });
    setIsAddStudentOpen(false);
    form.reset();
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusStyles = () => {
      switch (status) {
        case 'Enrolled':
          return 'bg-green-100 text-green-800 hover:bg-green-200';
        case 'Pending':
          return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
        case 'Transferee':
          return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
        default:
          return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      }
    };
    
    return (
      <Badge variant="outline" className={cn(
        "rounded-full font-normal",
        getStatusStyles()
      )}>
        {status}
      </Badge>
    );
  };
  
  return (
    <MainLayout>
      <PageHeader 
        title="Students"
        description="Manage and view all student records"
      >
        {checkPermission([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR]) && (
          <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student's information below to create a new record.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {['9', '10', '11', '12'].map((grade) => (
                                <SelectItem key={grade} value={grade}>
                                  Grade {grade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
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
                            <Input placeholder="student@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="guardian"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guardian/Parent Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Mary Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Add Student</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>
      
      <Card className="animate-fade-in">
        <CardHeader className="px-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>{selectedGrade === 'all' ? 'All Grades' : `Grade ${selectedGrade}`}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="9">Grade 9</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>{selectedStatus === 'all' ? 'All Status' : selectedStatus}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Enrolled">Enrolled</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Transferee">Transferee</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox 
                      checked={
                        paginatedStudents.length > 0 && 
                        selectedStudents.length === paginatedStudents.length
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>ID Number</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStudents.map((student) => (
                    <TableRow key={student.id} className="group animate-fade-in">
                      <TableCell>
                        <Checkbox 
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => handleSelectOne(student.id)}
                          aria-label={`Select ${student.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-xs text-muted-foreground">{student.email}</div>
                      </TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>
                        <StatusBadge status={student.status} />
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          student.balance > 0 ? "text-red-600" : "text-green-600"
                        )}>
                          {formatCurrency(student.balance)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {checkPermission([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR]) && (
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Student
                              </DropdownMenuItem>
                            )}
                            {checkPermission([UserRole.SUPER_ADMIN, UserRole.ADMIN]) && (
                              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between px-6">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{paginatedStudents.length}</span> of{" "}
            <span className="font-medium">{filteredStudents.length}</span> students
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </MainLayout>
  );
};

export default Students;

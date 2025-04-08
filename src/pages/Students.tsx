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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Search, Pencil, ArrowUpDown, ArrowUp, ArrowDown, User, Mail, Phone, Home, Calendar } from 'lucide-react';
import DataPagination from '@/components/common/DataPagination';
import { useGradeLevels } from './settings/SettingsGradeLevels';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';

const studentsData = [
  { 
    id: '1', 
    firstName: 'John', 
    lastName: 'Doe', 
    middleName: '', 
    suffix: '', 
    grade: 'Grade 10', 
    section: 'A', 
    gender: 'Male', 
    birthdate: new Date(2006, 5, 15),
    age: 17,
    address: '123 Main St, Anytown',
    email: 'john.doe@example.com',
    contact: '555-1234',
    guardianName: 'Mary Doe',
    guardianContact: '555-5678'
  },
  { 
    id: '2', 
    firstName: 'Jane', 
    lastName: 'Smith', 
    middleName: 'Marie', 
    suffix: '', 
    grade: 'Grade 11', 
    section: 'B', 
    gender: 'Female', 
    birthdate: new Date(2005, 3, 22),
    age: 18,
    address: '456 Oak Ave, Somewhere',
    email: 'jane.smith@example.com',
    contact: '555-5678',
    guardianName: 'Robert Smith',
    guardianContact: '555-8765'
  },
  { 
    id: '3', 
    firstName: 'Michael', 
    lastName: 'Johnson', 
    middleName: '', 
    suffix: '', 
    grade: 'Grade 9', 
    section: 'C', 
    gender: 'Male', 
    birthdate: new Date(2007, 9, 10),
    age: 16,
    address: '789 Pine Ln, Anotherplace',
    email: 'michael.johnson@example.com',
    contact: '555-9012',
    guardianName: 'Linda Johnson',
    guardianContact: '555-2345'
  },
  { 
    id: '4', 
    firstName: 'Emily', 
    lastName: 'Brown', 
    middleName: 'Grace', 
    suffix: '', 
    grade: 'Grade 12', 
    section: 'A', 
    gender: 'Female', 
    birthdate: new Date(2004, 11, 1),
    age: 19,
    address: '101 Elm Rd, Overthere',
    email: 'emily.brown@example.com',
    contact: '555-3456',
    guardianName: 'David Brown',
    guardianContact: '555-6789'
  },
  { 
    id: '5', 
    firstName: 'David', 
    lastName: 'Wilson', 
    middleName: '', 
    suffix: 'Jr.', 
    grade: 'Grade 10', 
    section: 'B', 
    gender: 'Male', 
    birthdate: new Date(2006, 1, 8),
    age: 17,
    address: '222 Maple Dr, Elsewhere',
    email: 'david.wilson@example.com',
    contact: '555-7890',
    guardianName: 'Susan Wilson',
    guardianContact: '555-4321'
  },
  { 
    id: '6', 
    firstName: 'Sarah', 
    lastName: 'Davis', 
    middleName: '', 
    suffix: '', 
    grade: 'Grade 11', 
    section: 'A', 
    gender: 'Female', 
    birthdate: new Date(2005, 7, 18),
    age: 18,
    address: '333 Cherry Ave, Somewhere Else',
    email: 'sarah.davis@example.com',
    contact: '555-2468',
    guardianName: 'Thomas Davis',
    guardianContact: '555-8901'
  },
  { 
    id: '7', 
    firstName: 'James', 
    lastName: 'Miller', 
    middleName: 'Edward', 
    suffix: '', 
    grade: 'Grade 9', 
    section: 'B', 
    gender: 'Male', 
    birthdate: new Date(2007, 4, 5),
    age: 16,
    address: '444 Oak St, Notown',
    email: 'james.miller@example.com',
    contact: '555-1357',
    guardianName: 'Patricia Miller',
    guardianContact: '555-5432'
  },
  { 
    id: '8', 
    firstName: 'Jessica', 
    lastName: 'Wilson', 
    middleName: '', 
    suffix: '', 
    grade: 'Grade 12', 
    section: 'C', 
    gender: 'Female', 
    birthdate: new Date(2004, 2, 28),
    age: 19,
    address: '555 Pine St, Anotherville',
    email: 'jessica.wilson@example.com',
    contact: '555-3690',
    guardianName: 'Richard Wilson',
    guardianContact: '555-9876'
  },
  { 
    id: '9', 
    firstName: 'Robert', 
    lastName: 'Taylor', 
    middleName: '', 
    suffix: 'Sr.', 
    grade: 'Grade 10', 
    section: 'A', 
    gender: 'Male', 
    birthdate: new Date(2006, 6, 12),
    age: 17,
    address: '666 Elm Ave, Thisplace',
    email: 'robert.taylor@example.com',
    contact: '555-4812',
    guardianName: 'Karen Taylor',
    guardianContact: '555-2109'
  },
  { 
    id: '10', 
    firstName: 'Linda', 
    lastName: 'Anderson', 
    middleName: '', 
    suffix: '', 
    grade: 'Grade 11', 
    section: 'B', 
    gender: 'Female', 
    birthdate: new Date(2005, 8, 3),
    age: 18,
    address: '777 Maple Rd, Thatplace',
    email: 'linda.anderson@example.com',
    contact: '555-9753',
    guardianName: 'Charles Anderson',
    guardianContact: '555-7654'
  },
  { 
    id: '11', 
    firstName: 'Thomas', 
    lastName: 'Martinez', 
    middleName: '', 
    suffix: '', 
    grade: 'Grade 9', 
    section: 'C', 
    gender: 'Male', 
    birthdate: new Date(2007, 0, 20),
    age: 16,
    address: '888 Cherry Ln, Uknownville',
    email: 'thomas.martinez@example.com',
    contact: '555-8642',
    guardianName: 'Elizabeth Martinez',
    guardianContact: '555-3210'
  },
  { 
    id: '12', 
    firstName: 'Patricia', 
    lastName: 'Lewis', 
    middleName: '', 
    suffix: '', 
    grade: 'Grade 12', 
    section: 'A', 
    gender: 'Female', 
    birthdate: new Date(2004, 4, 7),
    age: 19,
    address: '999 Oak Ln, Mysterytown',
    email: 'patricia.lewis@example.com',
    contact: '555-7531',
    guardianName: 'Daniel Lewis',
    guardianContact: '555-8791'
  },
];

const ITEMS_PER_PAGE = 5;

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'firstName' | 'lastName' | 'grade' | 'section' | 'gender' | 'contact' | 'email' | 'age' | null;

const StudentsPage = () => {
  const [students, setStudents] = useState(studentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    grade: '',
    section: '',
    gender: '',
    birthdate: new Date(),
    age: '',
    address: '',
    email: '',
    contact: '',
    guardianName: '',
    guardianContact: ''
  });
  const { toast } = useToast();
  const { gradeLevels } = useGradeLevels();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getFullName = (student) => {
    let fullName = `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`;
    if (student.suffix) {
      fullName += ` ${student.suffix}`;
    }
    return fullName;
  };

  const sortAndFilterStudents = () => {
    let result = students.filter(student => 
      getFullName(student).toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.includes(searchTerm) ||
      student.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (sortField && sortDirection) {
      result = [...result].sort((a, b) => {
        let aValue, bValue;

        if (sortField === 'firstName' || sortField === 'lastName') {
          aValue = a[sortField]?.toLowerCase() || '';
          bValue = b[sortField]?.toLowerCase() || '';
        } else {
          aValue = a[sortField]?.toString().toLowerCase() || '';
          bValue = b[sortField]?.toString().toLowerCase() || '';
        }
        
        if (sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }
    
    return result;
  };

  const filteredStudents = sortAndFilterStudents();
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" /> 
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
    
    // Calculate age if the birthdate changes
    if (field === 'birthdate' && date) {
      const today = new Date();
      let age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = () => {
    if (!formData.firstName || !formData.lastName || !formData.grade || !formData.section || !formData.gender) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (selectedStudent) {
      const updatedStudents = students.map(student => 
        student.id === selectedStudent.id ? { ...formData, id: student.id } : student
      );
      setStudents(updatedStudents);
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    } else {
      const newStudent = {
        id: (students.length + 1).toString(),
        ...formData
      };
      setStudents([...students, newStudent]);
      toast({
        title: "Success",
        description: "Student added successfully",
      });
    }
    
    setFormData({
      firstName: '',
      lastName: '',
      middleName: '',
      suffix: '',
      grade: '',
      section: '',
      gender: '',
      birthdate: new Date(),
      age: '',
      address: '',
      email: '',
      contact: '',
      guardianName: '',
      guardianContact: ''
    });
    setSelectedStudent(null);
    setIsAddDialogOpen(false);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      middleName: student.middleName || '',
      suffix: student.suffix || '',
      grade: student.grade,
      section: student.section,
      gender: student.gender,
      birthdate: student.birthdate,
      age: student.age.toString(),
      address: student.address,
      email: student.email,
      contact: student.contact,
      guardianName: student.guardianName,
      guardianContact: student.guardianContact
    });
    setIsAddDialogOpen(true);
  };

  const sortedGradeLevels = [...gradeLevels].sort((a, b) => a.sequence - b.sequence);

  return (
    <MainLayout>
      <PageHeader 
        title="Students" 
        description="Manage all student records"
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search students..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
              <DialogDescription>
                Fill in the details for the student record.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="contact">Contact Information</TabsTrigger>
                <TabsTrigger value="guardian">Guardian Information</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="mt-4">
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
                    <Label htmlFor="middleName" className="text-right">Middle Name</Label>
                    <Input 
                      id="middleName" 
                      name="middleName" 
                      value={formData.middleName} 
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
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gender" className="text-right">Gender*</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => handleSelectChange('gender', value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="birthdate" className="text-right">Birthdate</Label>
                    <Input 
                      id="birthdate" 
                      name="birthdate" 
                      type="date"
                      value={formData.birthdate ? format(new Date(formData.birthdate), 'yyyy-MM-dd') : ''}
                      onChange={(e) => handleDateChange(new Date(e.target.value), 'birthdate')}
                      className="col-span-3" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="age" className="text-right">Age</Label>
                    <Input 
                      id="age" 
                      name="age" 
                      value={formData.age} 
                      onChange={handleInputChange} 
                      className="col-span-3"
                      type="number"
                      min="0"
                      readOnly
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="grade" className="text-right">Grade*</Label>
                    <Select 
                      value={formData.grade} 
                      onValueChange={(value) => handleSelectChange('grade', value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortedGradeLevels.map((grade) => (
                          <SelectItem key={grade.id} value={grade.name}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="section" className="text-right">Section*</Label>
                    <Select 
                      value={formData.section} 
                      onValueChange={(value) => handleSelectChange('section', value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Section A</SelectItem>
                        <SelectItem value="B">Section B</SelectItem>
                        <SelectItem value="C">Section C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      className="col-span-3" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
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
                    <Label htmlFor="contact" className="text-right">Contact Number</Label>
                    <Input 
                      id="contact" 
                      name="contact" 
                      value={formData.contact} 
                      onChange={handleInputChange} 
                      className="col-span-3" 
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="guardian" className="mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="guardianName" className="text-right">Guardian Name</Label>
                    <Input 
                      id="guardianName" 
                      name="guardianName" 
                      value={formData.guardianName} 
                      onChange={handleInputChange} 
                      className="col-span-3" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="guardianContact" className="text-right">Guardian Contact</Label>
                    <Input 
                      id="guardianContact" 
                      name="guardianContact" 
                      value={formData.guardianContact} 
                      onChange={handleInputChange} 
                      className="col-span-3" 
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setSelectedStudent(null);
                setFormData({
                  firstName: '',
                  lastName: '',
                  middleName: '',
                  suffix: '',
                  grade: '',
                  section: '',
                  gender: '',
                  birthdate: new Date(),
                  age: '',
                  address: '',
                  email: '',
                  contact: '',
                  guardianName: '',
                  guardianContact: ''
                });
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddStudent}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableCaption>A list of all students</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => handleSort('firstName')}
              >
                <div className="flex items-center">
                  First Name
                  {renderSortIcon('firstName')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => handleSort('lastName')}
              >
                <div className="flex items-center">
                  Last Name
                  {renderSortIcon('lastName')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => handleSort('grade')}
              >
                <div className="flex items-center">
                  Grade
                  {renderSortIcon('grade')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => handleSort('section')}
              >
                <div className="flex items-center">
                  Section
                  {renderSortIcon('section')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => handleSort('gender')}
              >
                <div className="flex items-center">
                  Gender
                  {renderSortIcon('gender')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => handleSort('contact')}
              >
                <div className="flex items-center">
                  Contact
                  {renderSortIcon('contact')}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.contact}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEditStudent(student)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No students found
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
          onPageChange={setCurrentPage}
        />
      </div>
    </MainLayout>
  );
};

export default StudentsPage;

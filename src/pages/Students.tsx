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
import { PlusCircle, Search, Pencil } from 'lucide-react';
import DataPagination from '@/components/common/DataPagination';

const studentsData = [
  { id: '1', name: 'John Doe', grade: '10', section: 'A', gender: 'Male', contact: '555-1234' },
  { id: '2', name: 'Jane Smith', grade: '11', section: 'B', gender: 'Female', contact: '555-5678' },
  { id: '3', name: 'Michael Johnson', grade: '9', section: 'C', gender: 'Male', contact: '555-9012' },
  { id: '4', name: 'Emily Brown', grade: '12', section: 'A', gender: 'Female', contact: '555-3456' },
  { id: '5', name: 'David Wilson', grade: '10', section: 'B', gender: 'Male', contact: '555-7890' },
  { id: '6', name: 'Sarah Davis', grade: '11', section: 'A', gender: 'Female', contact: '555-2468' },
  { id: '7', name: 'James Miller', grade: '9', section: 'B', gender: 'Male', contact: '555-1357' },
  { id: '8', name: 'Jessica Wilson', grade: '12', section: 'C', gender: 'Female', contact: '555-3690' },
  { id: '9', name: 'Robert Taylor', grade: '10', section: 'A', gender: 'Male', contact: '555-4812' },
  { id: '10', name: 'Linda Anderson', grade: '11', section: 'B', gender: 'Female', contact: '555-9753' },
  { id: '11', name: 'Thomas Martinez', grade: '9', section: 'C', gender: 'Male', contact: '555-8642' },
  { id: '12', name: 'Patricia Lewis', grade: '12', section: 'A', gender: 'Female', contact: '555-7531' },
];

const ITEMS_PER_PAGE = 5;

const StudentsPage = () => {
  const [students, setStudents] = useState(studentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    section: '',
    gender: '',
    contact: ''
  });
  const { toast } = useToast();

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.includes(searchTerm) ||
    student.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = () => {
    if (!formData.name || !formData.grade || !formData.section || !formData.gender || !formData.contact) {
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
      name: '',
      grade: '',
      section: '',
      gender: '',
      contact: ''
    });
    setSelectedStudent(null);
    setIsAddDialogOpen(false);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      grade: student.grade,
      section: student.section,
      gender: student.gender,
      contact: student.contact
    });
    setIsAddDialogOpen(true);
  };

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
              <DialogDescription>
                Fill in the details for the student record.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="grade" className="text-right">Grade</Label>
                <Select 
                  value={formData.grade} 
                  onValueChange={(value) => handleSelectChange('grade', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="section" className="text-right">Section</Label>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gender" className="text-right">Gender</Label>
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
                <Label htmlFor="contact" className="text-right">Contact</Label>
                <Input 
                  id="contact" 
                  name="contact" 
                  value={formData.contact} 
                  onChange={handleInputChange} 
                  className="col-span-3" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setSelectedStudent(null);
                setFormData({
                  name: '',
                  grade: '',
                  section: '',
                  gender: '',
                  contact: ''
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
              <TableHead>Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
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
                <TableCell colSpan={6} className="text-center py-6">
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

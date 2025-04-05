import React, { useState, useEffect } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { PlusCircle, Search, Pencil, FileText, CheckCircle2, XCircle, FileCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import DataPagination from '@/components/common/DataPagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentRequirements } from '@/components/enrollment/DocumentRequirements';
import { StudentSelect } from '@/components/students/StudentSelect';

const studentsData = [
  { id: 'S001', name: 'John Doe', grade: '10', section: 'A', gender: 'Male', contact: '555-1234' },
  { id: 'S002', name: 'Jane Smith', grade: '11', section: 'B', gender: 'Female', contact: '555-5678' },
  { id: 'S003', name: 'Michael Johnson', grade: '9', section: 'C', gender: 'Male', contact: '555-9012' },
  { id: 'S004', name: 'Emily Brown', grade: '12', section: 'A', gender: 'Female', contact: '555-3456' },
  { id: 'S005', name: 'David Wilson', grade: '10', section: 'B', gender: 'Male', contact: '555-7890' },
  { id: 'S006', name: 'Sarah Davis', grade: '11', section: 'A', gender: 'Female', contact: '555-2468' },
  { id: 'S007', name: 'James Miller', grade: '9', section: 'B', gender: 'Male', contact: '555-1357' },
  { id: 'S008', name: 'Jessica Wilson', grade: '12', section: 'C', gender: 'Female', contact: '555-3690' },
  { id: 'S009', name: 'Robert Taylor', grade: '10', section: 'A', gender: 'Male', contact: '555-4812' },
  { id: 'S010', name: 'Linda Anderson', grade: '11', section: 'B', gender: 'Female', contact: '555-9753' },
  { id: 'S011', name: 'Thomas Martinez', grade: '9', section: 'C', gender: 'Male', contact: '555-8642' },
  { id: 'S012', name: 'Patricia Lewis', grade: '12', section: 'A', gender: 'Female', contact: '555-7531' },
];

const enrollmentData = [
  { 
    id: '1', 
    studentName: 'John Doe', 
    studentId: 'S001', 
    academicYear: '2023-2024', 
    grade: '10', 
    enrollmentDate: new Date(2023, 7, 15), 
    status: 'Active',
    feesPaid: true
  },
  { 
    id: '2', 
    studentName: 'Jane Smith', 
    studentId: 'S002', 
    academicYear: '2023-2024', 
    grade: '11', 
    enrollmentDate: new Date(2023, 7, 12), 
    status: 'Active',
    feesPaid: true
  },
  { 
    id: '3', 
    studentName: 'Michael Johnson', 
    studentId: 'S003', 
    academicYear: '2023-2024', 
    grade: '9', 
    enrollmentDate: new Date(2023, 7, 20), 
    status: 'Pending',
    feesPaid: false
  },
  { 
    id: '4', 
    studentName: 'Emily Brown', 
    studentId: 'S004', 
    academicYear: '2023-2024', 
    grade: '12', 
    enrollmentDate: new Date(2023, 7, 5), 
    status: 'Active',
    feesPaid: true
  },
  { 
    id: '5', 
    studentName: 'William White', 
    studentId: 'S005', 
    academicYear: '2023-2024', 
    grade: '9', 
    enrollmentDate: new Date(2023, 7, 8), 
    status: 'Active',
    feesPaid: true
  },
  { 
    id: '6', 
    studentName: 'Olivia Green', 
    studentId: 'S006', 
    academicYear: '2023-2024', 
    grade: '10', 
    enrollmentDate: new Date(2023, 7, 10), 
    status: 'Pending',
    feesPaid: false
  },
  { 
    id: '7', 
    studentName: 'James Taylor', 
    studentId: 'S007', 
    academicYear: '2023-2024', 
    grade: '11', 
    enrollmentDate: new Date(2023, 7, 3), 
    status: 'Active',
    feesPaid: true
  },
  { 
    id: '8', 
    studentName: 'Sophia Adams', 
    studentId: 'S008', 
    academicYear: '2023-2024', 
    grade: '12', 
    enrollmentDate: new Date(2023, 7, 7), 
    status: 'Pending',
    feesPaid: false
  },
];

const ITEMS_PER_PAGE = 5;

const EnrollmentPage = () => {
  const [enrollments, setEnrollments] = useState(enrollmentData);
  const [students, setStudents] = useState(studentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("enrollments");
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    academicYear: '2023-2024',
    grade: '',
    section: '',
    gender: '',
    contact: '',
    status: 'Pending',
    feesPaid: false
  });
  const { toast } = useToast();

  const filteredEnrollments = enrollments.filter(enrollment => 
    enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEnrollments.length / ITEMS_PER_PAGE);
  const paginatedEnrollments = filteredEnrollments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleStudentSelect = (value, selectedStudent) => {
    if (selectedStudent) {
      setFormData(prev => ({
        ...prev,
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        grade: selectedStudent.grade || '',
        section: selectedStudent.section || '',
        gender: selectedStudent.gender || '',
        contact: selectedStudent.contact || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        studentId: value,
        studentName: '',
        grade: '',
        section: '',
        gender: '',
        contact: ''
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddEnrollment = () => {
    if (!formData.studentName || !formData.studentId || !formData.grade) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (selectedEnrollment) {
      const updatedEnrollments = enrollments.map(enrollment => 
        enrollment.id === selectedEnrollment.id 
          ? { 
              ...enrollment, 
              ...formData,
              enrollmentDate: enrollment.enrollmentDate
            } 
          : enrollment
      );
      setEnrollments(updatedEnrollments);
      toast({
        title: "Success",
        description: "Enrollment updated successfully",
      });
    } else {
      const newEnrollment = {
        id: (enrollments.length + 1).toString(),
        ...formData,
        enrollmentDate: new Date()
      };
      setEnrollments([...enrollments, newEnrollment]);
      toast({
        title: "Success",
        description: "Enrollment added successfully",
      });
    }
    
    setFormData({
      studentName: '',
      studentId: '',
      academicYear: '2023-2024',
      grade: '',
      section: '',
      gender: '',
      contact: '',
      status: 'Pending',
      feesPaid: false
    });
    setSelectedEnrollment(null);
    setIsAddDialogOpen(false);
  };

  const handleEditEnrollment = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setFormData({
      studentName: enrollment.studentName,
      studentId: enrollment.studentId,
      academicYear: enrollment.academicYear,
      grade: enrollment.grade,
      section: enrollment.section,
      gender: enrollment.gender,
      contact: enrollment.contact,
      status: enrollment.status,
      feesPaid: enrollment.feesPaid
    });
    setIsAddDialogOpen(true);
  };

  const handleViewDocuments = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setActiveTab("requirements");
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return <Badge className="bg-green-500">Active</Badge>;
    } else if (status === 'Pending') {
      return <Badge className="bg-yellow-500">Pending</Badge>;
    } else {
      return <Badge className="bg-red-500">Inactive</Badge>;
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      studentId: '',
      academicYear: '2023-2024',
      grade: '',
      section: '',
      gender: '',
      contact: '',
      status: 'Pending',
      feesPaid: false
    });
    setSelectedEnrollment(null);
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Enrollment" 
        description="Manage student enrollments for academic years"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="requirements">Document Requirements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enrollments" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search enrollments..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Enrollment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{selectedEnrollment ? 'Edit Enrollment' : 'New Enrollment'}</DialogTitle>
                  <DialogDescription>
                    Enter the enrollment details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="studentId" className="text-right">Student</Label>
                    <div className="col-span-3">
                      <StudentSelect 
                        students={students}
                        value={formData.studentId}
                        onValueChange={handleStudentSelect}
                        placeholder="Select a student"
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="studentName" className="text-right">Student Name</Label>
                    <Input 
                      id="studentName" 
                      name="studentName" 
                      value={formData.studentName} 
                      onChange={handleInputChange} 
                      className="col-span-3"
                      readOnly
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="grade" className="text-right">Grade</Label>
                    <Input 
                      id="grade" 
                      name="grade" 
                      value={formData.grade} 
                      onChange={handleInputChange} 
                      className="col-span-3"
                      readOnly
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="section" className="text-right">Section</Label>
                    <Input 
                      id="section" 
                      name="section" 
                      value={formData.section} 
                      onChange={handleInputChange} 
                      className="col-span-3"
                      readOnly
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="academicYear" className="text-right">Academic Year</Label>
                    <Select 
                      value={formData.academicYear} 
                      onValueChange={(value) => handleSelectChange('academicYear', value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2022-2023">2022-2023</SelectItem>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
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
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="feesPaid" className="text-right">Fees Paid</Label>
                    <div className="col-span-3 flex items-center">
                      <Checkbox 
                        id="feesPaid"
                        checked={formData.feesPaid}
                        onCheckedChange={(checked) => handleCheckboxChange('feesPaid', checked)}
                      />
                      <Label htmlFor="feesPaid" className="ml-2">Yes</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEnrollment}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>List of student enrollments</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Enrollment Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fees Paid</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEnrollments.length > 0 ? (
                  paginatedEnrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-medium">{enrollment.studentName}</TableCell>
                      <TableCell>{enrollment.studentId}</TableCell>
                      <TableCell>{enrollment.academicYear}</TableCell>
                      <TableCell>{enrollment.grade}</TableCell>
                      <TableCell>{format(enrollment.enrollmentDate, 'MMM d, yyyy')}</TableCell>
                      <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                      <TableCell>
                        {enrollment.feesPaid ? 
                          <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditEnrollment(enrollment)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleViewDocuments(enrollment)}>
                            <FileCheck className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No enrollments found
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
        </TabsContent>
        
        <TabsContent value="requirements" className="mt-6">
          {selectedEnrollment ? (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Documents for {selectedEnrollment.studentName} ({selectedEnrollment.studentId})
                </h3>
                <Button variant="outline" onClick={() => setSelectedEnrollment(null)}>
                  View All Requirements
                </Button>
              </div>
              <DocumentRequirements studentId={selectedEnrollment.studentId} />
            </div>
          ) : (
            <DocumentRequirements studentId={null} />
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default EnrollmentPage;


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
import { PlusCircle, Search, Pencil, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

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
];

const EnrollmentPage = () => {
  const [enrollments, setEnrollments] = useState(enrollmentData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    academicYear: '2023-2024',
    grade: '',
    status: 'Pending',
    feesPaid: false
  });
  const { toast } = useToast();

  const filteredEnrollments = enrollments.filter(enrollment => 
    enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    // Validate form
    if (!formData.studentName || !formData.studentId || !formData.grade) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (selectedEnrollment) {
      // Update existing enrollment
      const updatedEnrollments = enrollments.map(enrollment => 
        enrollment.id === selectedEnrollment.id 
          ? { 
              ...enrollment, 
              ...formData,
              enrollmentDate: enrollment.enrollmentDate // Keep the original date
            } 
          : enrollment
      );
      setEnrollments(updatedEnrollments);
      toast({
        title: "Success",
        description: "Enrollment updated successfully",
      });
    } else {
      // Add new enrollment
      const newEnrollment = {
        id: (enrollments.length + 1).toString(),
        ...formData,
        enrollmentDate: new Date() // Current date
      };
      setEnrollments([...enrollments, newEnrollment]);
      toast({
        title: "Success",
        description: "Enrollment added successfully",
      });
    }
    
    // Reset form and close dialog
    setFormData({
      studentName: '',
      studentId: '',
      academicYear: '2023-2024',
      grade: '',
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
      status: enrollment.status,
      feesPaid: enrollment.feesPaid
    });
    setIsAddDialogOpen(true);
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

  return (
    <MainLayout>
      <PageHeader 
        title="Enrollment" 
        description="Manage student enrollments for academic years"
      />
      
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEnrollment ? 'Edit Enrollment' : 'New Enrollment'}</DialogTitle>
              <DialogDescription>
                Enter the enrollment details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="studentName" className="text-right">Student Name</Label>
                <Input 
                  id="studentName" 
                  name="studentName" 
                  value={formData.studentName} 
                  onChange={handleInputChange} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="studentId" className="text-right">Student ID</Label>
                <Input 
                  id="studentId" 
                  name="studentId" 
                  value={formData.studentId} 
                  onChange={handleInputChange} 
                  className="col-span-3" 
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
                  <input 
                    type="checkbox" 
                    id="feesPaid"
                    checked={formData.feesPaid}
                    onChange={(e) => handleCheckboxChange('feesPaid', e.target.checked)}
                    className="mr-2 h-4 w-4"
                  />
                  <Label htmlFor="feesPaid">Yes</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setSelectedEnrollment(null);
                setFormData({
                  studentName: '',
                  studentId: '',
                  academicYear: '2023-2024',
                  grade: '',
                  status: 'Pending',
                  feesPaid: false
                });
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
            {filteredEnrollments.length > 0 ? (
              filteredEnrollments.map((enrollment) => (
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
                    <Button variant="ghost" size="sm" onClick={() => handleEditEnrollment(enrollment)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
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
    </MainLayout>
  );
};

export default EnrollmentPage;

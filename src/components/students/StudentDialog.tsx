
import React from 'react';
import {
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import StudentForm, { StudentFormData } from './StudentForm';

type GradeLevel = {
  id: string;
  name: string;
  sequence: number;
};

interface StudentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: StudentFormData;
  gradeLevels: GradeLevel[];
  selectedStudentId: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (date: Date, field: string) => void;
  onSelectChange: (name: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const StudentDialog: React.FC<StudentDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  gradeLevels,
  selectedStudentId,
  onInputChange,
  onDateChange,
  onSelectChange,
  onSave,
  onCancel
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{selectedStudentId ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          <DialogDescription>
            Fill in the details for the student record.
          </DialogDescription>
        </DialogHeader>
        
        <StudentForm
          formData={formData}
          gradeLevels={gradeLevels}
          selectedStudentId={selectedStudentId}
          onInputChange={onInputChange}
          onDateChange={onDateChange}
          onSelectChange={onSelectChange}
          onSave={onSave}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StudentDialog;

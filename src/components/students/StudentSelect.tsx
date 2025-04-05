
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

interface Student {
  id: string;
  name: string;
  grade?: string;
  section?: string;
  gender?: string;
  contact?: string;
}

interface StudentSelectProps {
  students: Student[];
  value: string;
  onValueChange: (value: string, student: Student | undefined) => void;
  placeholder?: string;
  className?: string;
}

export const StudentSelect: React.FC<StudentSelectProps> = ({
  students,
  value,
  onValueChange,
  placeholder = "Select a student",
  className
}) => {
  const handleValueChange = (newValue: string) => {
    const selectedStudent = students.find(student => student.id === newValue);
    onValueChange(newValue, selectedStudent);
  };

  return (
    <Select 
      value={value} 
      onValueChange={handleValueChange}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {students.length > 0 ? (
          students.map((student) => (
            <SelectItem key={student.id} value={student.id}>
              {student.name} ({student.id})
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-students" disabled>
            No students available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

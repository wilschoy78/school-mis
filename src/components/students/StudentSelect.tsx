
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  students = [], // Default empty array
  value = '',   // Default empty string
  onValueChange,
  placeholder = "Select a student",
  className
}) => {
  // Ensure students is always an array to prevent iteration errors
  const safeStudents = Array.isArray(students) ? students : [];
  
  // Handle student selection
  const handleValueChange = (selectedValue: string) => {
    const student = safeStudents.find(s => s.id === selectedValue);
    onValueChange(selectedValue, student);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {safeStudents.length > 0 ? (
          safeStudents.map((student) => (
            <SelectItem key={student.id} value={student.id}>
              {student.name} ({student.id})
            </SelectItem>
          ))
        ) : (
          <div className="p-2 text-sm text-center text-muted-foreground">
            No students available
          </div>
        )}
      </SelectContent>
    </Select>
  );
};

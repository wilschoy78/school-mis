
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface StudentSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const StudentSearch: React.FC<StudentSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative w-64">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search students..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default StudentSearch;

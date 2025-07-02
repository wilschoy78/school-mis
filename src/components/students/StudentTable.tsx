
import React from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Pencil, ArrowUpDown, ArrowUp, ArrowDown, 
  FileText, FileSpreadsheet, FileDown 
} from 'lucide-react';
import DataPagination from '@/components/common/DataPagination';
import { Student, SortDirection, SortField } from '@/types/student';

interface StudentTableProps {
  students: Student[];
  currentPage: number;
  totalPages: number;
  sortField: SortField;
  sortDirection: SortDirection;
  onPageChange: (page: number) => void;
  onEditStudent: (student: Student) => void;
  onSort: (field: SortField) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  currentPage,
  totalPages,
  sortField,
  sortDirection,
  onPageChange,
  onEditStudent,
  onSort
}) => {
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" /> 
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const generateCSV = () => {
    const headers = ['First Name', 'Last Name', 'Grade', 'Section', 'Gender', 'Contact'];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    students.forEach(student => {
      const row = [
        student.firstName,
        student.lastName,
        student.grade,
        student.section,
        student.gender,
        student.contact
      ].map(value => `"${value}"`).join(',');
      
      csvContent += row + '\n';
    });
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'students.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateExcel = () => {
    // For demonstration, we're actually creating a CSV that Excel can open
    // In a real app, you might use a library like exceljs or xlsx
    generateCSV();
  };

  const generatePDF = () => {
    // For demonstration purposes only
    // In a real app, you would use a library like jspdf or pdfmake
    console.log('Generating PDF with student data', students);
    alert("PDF generation would require a PDF library. This is a placeholder for demonstration.");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Total: {students.length} students
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={generateCSV}>
            <FileText className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={generateExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={generatePDF}>
            <FileDown className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableCaption>A list of all students</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => onSort('firstName')}
              >
                <div className="flex items-center">
                  First Name
                  {renderSortIcon('firstName')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => onSort('lastName')}
              >
                <div className="flex items-center">
                  Last Name
                  {renderSortIcon('lastName')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => onSort('grade')}
              >
                <div className="flex items-center">
                  Grade
                  {renderSortIcon('grade')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => onSort('section')}
              >
                <div className="flex items-center">
                  Section
                  {renderSortIcon('section')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => onSort('gender')}
              >
                <div className="flex items-center">
                  Gender
                  {renderSortIcon('gender')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => onSort('contact')}
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
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.contact}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onEditStudent(student)}>
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
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default StudentTable;

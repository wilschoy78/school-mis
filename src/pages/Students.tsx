import React from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { useGradeLevels } from './settings/SettingsGradeLevels';
import StudentTable from '@/components/students/StudentTable';
import StudentSearch from '@/components/students/StudentSearch';
import StudentDialog from '@/components/students/StudentDialog';
import { useStudentManagement } from '@/hooks/useStudentManagement';

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

const StudentsPage = () => {
  const { gradeLevels } = useGradeLevels();
  const { 
    paginatedStudents,
    currentPage,
    totalPages,
    sortField,
    sortDirection,
    searchTerm,
    isAddDialogOpen,
    selectedStudent,
    formData,
    setSearchTerm,
    setIsAddDialogOpen,
    setCurrentPage,
    handleSort,
    handleInputChange,
    handleDateChange,
    handleSelectChange,
    handleAddOrUpdateStudent,
    handleEditStudent,
    resetFormAndDialog
  } = useStudentManagement(studentsData);

  return (
    <MainLayout>
      <PageHeader 
        title="Students" 
        description="Manage all student records"
      />
      
      <div className="flex justify-between items-center mb-6">
        <StudentSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <StudentDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          formData={formData}
          gradeLevels={gradeLevels}
          selectedStudentId={selectedStudent?.id || null}
          onInputChange={handleInputChange}
          onDateChange={handleDateChange}
          onSelectChange={handleSelectChange}
          onSave={handleAddOrUpdateStudent}
          onCancel={resetFormAndDialog}
        />
      </div>

      <StudentTable
        students={paginatedStudents}
        currentPage={currentPage}
        totalPages={totalPages}
        sortField={sortField}
        sortDirection={sortDirection}
        onPageChange={setCurrentPage}
        onEditStudent={handleEditStudent}
        onSort={handleSort}
      />
    </MainLayout>
  );
};

export default StudentsPage;

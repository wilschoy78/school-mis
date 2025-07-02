import React from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { useGradeLevels } from './settings/SettingsGradeLevels';
import StudentTable from '@/components/students/StudentTable';
import StudentSearch from '@/components/students/StudentSearch';
import StudentDialog from '@/components/students/StudentDialog';
import { useStudentManagement } from '@/hooks/useStudentManagement';

const StudentsPage = () => {
  const { gradeLevels } = useGradeLevels();
  const { 
    paginatedStudents,
    loading,
    error,
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
  } = useStudentManagement();

  if (loading) {
    return (
      <MainLayout>
        <PageHeader 
          title="Students" 
          description="Manage all student records"
        />
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <PageHeader 
          title="Students" 
          description="Manage all student records"
        />
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    );
  }

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

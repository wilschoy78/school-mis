
import React from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { DocumentRequirements } from '@/components/enrollment/DocumentRequirements';

const SettingsDocuments = () => {
  return (
    <MainLayout>
      <PageHeader 
        title="Document Requirements" 
        description="Manage document requirements for student enrollment"
      />
      
      <DocumentRequirements studentId={null} />
    </MainLayout>
  );
};

export default SettingsDocuments;

import React from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';

interface ErrorPageProps {
  title: string;
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ title, message }) => {
  return (
    <MainLayout>
      <PageHeader 
        title={title}
        description="An error occurred"
      />
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-red-500">{message}</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default ErrorPage;

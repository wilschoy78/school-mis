import React from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';

// Just redirecting from the old /users route to this new location
const SettingsUsers = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Redirect to the original Users page (assuming we want to keep the same content)
    navigate('/users', { replace: true });
  }, [navigate]);
  
  return (
    <MainLayout>
      <div className="flex items-center justify-center h-64">
        <p>Redirecting to user management...</p>
      </div>
    </MainLayout>
  );
};

export default SettingsUsers;

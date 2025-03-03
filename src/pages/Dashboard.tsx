
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { 
  WelcomeCard,
  QuickStats,
  QuickAccess,
  ActivityAndEvents
} from '@/components/dashboard';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <PageHeader 
        title="Dashboard" 
        description="Welcome to your school management dashboard"
      />
      
      <WelcomeCard user={user} />
      <QuickStats />
      <QuickAccess />
      <ActivityAndEvents />
    </MainLayout>
  );
};

export default Dashboard;

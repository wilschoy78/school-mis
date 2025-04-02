
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BookOpen } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { LoginForm } from '@/components/auth/LoginForm';
import { useSystemSettings } from './Settings';

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { systemName } = useSystemSettings();
  const { toast } = useToast();
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex justify-center items-center mb-4">
        <BookOpen className="h-10 w-10 text-primary mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">{systemName}</h1>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;

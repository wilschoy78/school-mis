
import React from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = true,
  className 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-school-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className={cn(
        "flex-1 transition-all duration-300",
        isMobile ? "w-full" : "ml-[70px] lg:ml-[250px]",
        className
      )}>
        <div className="h-full px-0">
          {children}
        </div>
      </main>
    </div>
  );
};

// Page header component
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight animate-fade-in">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1 animate-fade-in animation-delay-100">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
      <Separator className="mt-6" />
    </div>
  );
};

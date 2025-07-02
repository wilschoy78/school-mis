
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarMobile } from './SidebarMobile';
import { SidebarDesktop } from './SidebarDesktop';
import { SidebarContent } from './SidebarContent';

export interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If user is not logged in or still loading, don't show sidebar
  if (isLoading || !isAuthenticated) return null;

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <SidebarContent 
      collapsed={collapsed}
      toggleSidebar={toggleSidebar}
      location={location}
      isMobile={isMobile}
      closeMobileSidebar={closeMobileSidebar}
      className={className}
    />
  );

  // Mobile sidebar with overlay
  if (isMobile) {
    return (
      <SidebarMobile 
        sidebarContent={sidebarContent} 
        mobileSidebarOpen={mobileSidebarOpen} 
        toggleMobileSidebar={toggleMobileSidebar} 
      />
    );
  }

  return <SidebarDesktop sidebarContent={sidebarContent} />;
};

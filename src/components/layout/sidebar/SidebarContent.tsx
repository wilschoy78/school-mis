
import React from 'react';
import { Location } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarFooter } from './SidebarFooter';
import { User } from '@/context/AuthContext';

interface SidebarContentProps {
  user: User;
  collapsed: boolean;
  toggleSidebar: () => void;
  location: Location;
  isMobile: boolean;
  closeMobileSidebar: () => void;
  className?: string;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  user,
  collapsed,
  toggleSidebar,
  location,
  isMobile,
  closeMobileSidebar,
  className
}) => {
  return (
    <div
      className={cn(
        'h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out',
        collapsed ? 'w-[70px]' : 'w-[250px]',
        className
      )}
    >
      <SidebarHeader user={user} collapsed={collapsed} toggleSidebar={toggleSidebar} isMobile={isMobile} />
      <SidebarNavigation user={user} collapsed={collapsed} location={location} closeMobileSidebar={closeMobileSidebar} />
      <SidebarFooter collapsed={collapsed} />
    </div>
  );
};

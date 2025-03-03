
import React from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarMobileProps {
  sidebarContent: React.ReactNode;
  mobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
}

export const SidebarMobile: React.FC<SidebarMobileProps> = ({
  sidebarContent,
  mobileSidebarOpen,
  toggleMobileSidebar
}) => {
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          mobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleMobileSidebar}
      />
      <div 
        className={cn(
          "fixed left-0 top-0 z-50 h-full transform transition-transform duration-300 ease-in-out",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
};

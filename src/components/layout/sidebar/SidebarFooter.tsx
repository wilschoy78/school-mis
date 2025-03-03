
import React from 'react';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface SidebarFooterProps {
  collapsed: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed }) => {
  const { logout } = useAuth();
  
  return (
    <div className="p-4">
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent',
          collapsed && 'justify-center'
        )}
        onClick={logout}
      >
        <LogOut className="w-5 h-5 mr-2" />
        {!collapsed && <span>Logout</span>}
      </Button>
    </div>
  );
};

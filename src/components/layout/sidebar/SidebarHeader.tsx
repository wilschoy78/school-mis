
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { User } from '@/types/auth';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { useSystemSettings } from '@/pages/Settings';

import { useAuth } from '@/context/AuthContext';

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ 
  collapsed, 
  toggleSidebar, 
  isMobile 
}) => {
  const { user } = useAuth();
  const { systemName, logo } = useSystemSettings();
  
  if (!user) {
    return null;
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return '??';
  };

  const fullName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email || 'User';

  return (
    <>
      {/* Logo and collapse button section */}
      <div className={cn(
        'flex items-center justify-between p-4',
        collapsed && 'justify-center'
      )}>
        {!collapsed && (
          <Link to="/dashboard" className="text-lg font-semibold text-sidebar-foreground flex items-center gap-2">
            {logo ? (
              <img src={logo} alt={systemName} className="w-6 h-6 object-contain" />
            ) : (
              <BookOpen className="w-6 h-6 text-school-500" />
            )}
            <span className="animate-fade-in">{systemName}</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/dashboard" className="text-sidebar-foreground">
            {logo ? (
              <img src={logo} alt={systemName} className="w-6 h-6 object-contain" />
            ) : (
              <BookOpen className="w-6 h-6 text-school-500" />
            )}
          </Link>
        )}
        
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="text-sidebar-foreground hover:bg-sidebar-accent rounded-full w-8 h-8"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* User info */}
      {collapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-center p-4">
                <Avatar className="h-9 w-9 border border-sidebar-border">
                  <AvatarImage src={user.avatar} alt={fullName} />
                  <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="flex flex-col">
                <span className="font-medium">{fullName}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</span>
                {user.department && <span className="text-xs text-muted-foreground">{user.department}</span>}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-9 w-9 border border-sidebar-border">
            <AvatarImage src={user.avatar} alt={fullName} />
            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col animate-fade-in">
            <span className="text-sm font-medium text-sidebar-foreground">{fullName}</span>
            <span className="text-xs text-sidebar-foreground/70 capitalize">{user.role.replace('_', ' ')}</span>
          </div>
        </div>
      )}

      <Separator className="bg-sidebar-border" />
    </>
  );
};

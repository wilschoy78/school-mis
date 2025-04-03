
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
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { User } from '@/context/AuthContext';
import { useSystemSettings } from '@/pages/Settings';

interface SidebarHeaderProps {
  user: User;
  collapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ 
  user, 
  collapsed, 
  toggleSidebar, 
  isMobile 
}) => {
  const { systemName, logo } = useSystemSettings();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

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
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</span>
                {user.department && <span className="text-xs text-muted-foreground">{user.department}</span>}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-9 w-9 border border-sidebar-border">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col animate-fade-in">
            <span className="text-sm font-medium text-sidebar-foreground">{user.name}</span>
            <span className="text-xs text-sidebar-foreground/70 capitalize">{user.role.replace('_', ' ')}</span>
          </div>
        </div>
      )}

      <Separator className="bg-sidebar-border" />
    </>
  );
};

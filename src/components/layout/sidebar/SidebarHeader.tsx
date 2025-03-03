
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/context/AuthContext';

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
            <BookOpen className="w-6 h-6 text-school-500" />
            <span className="animate-fade-in">EduManager</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/dashboard" className="text-sidebar-foreground">
            <BookOpen className="w-6 h-6 text-school-500" />
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
      <div className={cn(
        'flex items-center gap-3 p-4',
        collapsed && 'justify-center'
      )}>
        <Avatar className="h-9 w-9 border border-sidebar-border">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-col animate-fade-in">
            <span className="text-sm font-medium text-sidebar-foreground">{user.name}</span>
            <span className="text-xs text-sidebar-foreground/70 capitalize">{user.role.replace('_', ' ')}</span>
          </div>
        )}
      </div>

      <Separator className="bg-sidebar-border" />
    </>
  );
};

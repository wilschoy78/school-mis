
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  GraduationCap,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  User,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, checkPermission } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If user is not logged in, don't show sidebar
  if (!user) return null;

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR, UserRole.CASHIER, UserRole.TEACHER],
    },
    {
      name: 'Students',
      path: '/students',
      icon: <GraduationCap className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR, UserRole.TEACHER],
    },
    {
      name: 'Enrollment',
      path: '/enrollment',
      icon: <BookOpen className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR],
    },
    {
      name: 'Accounts',
      path: '/accounts',
      icon: <DollarSign className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CASHIER],
    },
    {
      name: 'Employees',
      path: '/employees',
      icon: <Users className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
  ].filter(item => checkPermission(item.roles));

  // Mobile menu button (only visible on mobile)
  const mobileMenuButton = isMobile && (
    <Button 
      variant="ghost" 
      size="icon" 
      className="fixed top-4 left-4 z-50 lg:hidden"
      onClick={toggleMobileSidebar}
    >
      <Menu className="h-6 w-6" />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  );

  const sidebarContent = (
    <div
      className={cn(
        'h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out',
        collapsed ? 'w-[70px]' : 'w-[250px]',
        className
      )}
    >
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200',
                    isActive 
                      ? 'bg-school-100 text-school-700 font-medium' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <span className={cn(
                    "transition-transform",
                    isActive && "text-school-600"
                  )}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="animate-fade-in">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Logout button */}
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
    </div>
  );

  // Mobile sidebar with overlay
  if (isMobile) {
    return (
      <>
        {mobileMenuButton}
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
  }

  return sidebarContent;
};

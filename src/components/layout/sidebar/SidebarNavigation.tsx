
import React from 'react';
import { Link, Location } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  DollarSign, 
  Settings, 
  BookOpen,
  Library as LibraryIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, UserRole, User } from '@/context/AuthContext';

interface SidebarNavigationProps {
  user: User;
  collapsed: boolean;
  location: Location;
  closeMobileSidebar: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  user,
  collapsed,
  location,
  closeMobileSidebar
}) => {
  const { checkPermission } = useAuth();

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
      name: 'Library',
      path: '/library',
      icon: <LibraryIcon className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.REGISTRAR],
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
  ].filter(item => checkPermission(item.roles));

  return (
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
  );
};

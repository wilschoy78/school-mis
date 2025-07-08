
import React, { useState } from 'react';
import { Link, Location } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  DollarSign, 
  Settings, 
  BookOpen,
  LibraryIcon,
  UserCog,
  Bell,
  Shield,
  FileText,
  School,
  Section,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { UserRole, User } from '@/types';

interface SidebarNavigationProps {
  collapsed: boolean;
  location: Location;
  closeMobileSidebar: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  collapsed,
  location,
  closeMobileSidebar
}) => {
  const { user, checkPermission } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(
    location.pathname.startsWith('/settings') || location.pathname === '/users'
  );

  React.useEffect(() => {
    if (location.pathname.startsWith('/settings') || location.pathname === '/users') {
      setSettingsOpen(true);
    }
  }, [location.pathname]);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR, UserRole.CASHIER, UserRole.TEACHER, UserRole.LIBRARIAN, UserRole.STUDENT],
    },
    {
      name: 'Students',
      path: '/students',
      icon: <GraduationCap className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR, UserRole.TEACHER],
    },
    // {
    //   name: 'Enrollment',
    //   path: '/enrollment',
    //   icon: <BookOpen className="w-5 h-5" />,
    //   roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR],
    // },
    // {
    //   name: 'Accounts',
    //   path: '/accounts',
    //   icon: <DollarSign className="w-5 h-5" />,
    //   roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CASHIER],
    // },
    // {
    //   name: 'Employees',
    //   path: '/employees',
    //   icon: <Users className="w-5 h-5" />,
    //   roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    // },
    // {
    //   name: 'Library',
    //   path: '/library',
    //   icon: <LibraryIcon className="w-5 h-5" />,
    //   roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.LIBRARIAN, UserRole.STUDENT],
    // },
  ].filter(item => checkPermission(item.roles));

  // Settings sub-menu items
  const settingsSubItems = [
    {
      name: 'School',
      path: '/settings/school',
      icon: <School className="w-4 h-4" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    {
      name: 'Users',
      path: '/users',
      icon: <UserCog className="w-4 h-4" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    // {
    //   name: 'Grade Levels',
    //   path: '/settings/grade-levels',
    //   icon: <GraduationCap className="w-4 h-4" />,
    //   roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR],
    // },
    // {
    //   name: 'Notifications',
    //   path: '/settings/notifications',
    //   icon: <Bell className="w-4 h-4" />,
    //   roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    // },
    // {
    //   name: 'Security',
    //   path: '/settings/security',
    //   icon: <Shield className="w-4 h-4" />,
    //   roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    // },
    // {
    //   name: 'Documents',
    //   path: '/settings/documents',
    //   icon: <FileText className="w-4 h-4" />,
    //   roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR],
    // },
    // {
    //   name: 'Sections',
    //   path: '/settings/sections',
    //   icon: <Section className="w-4 h-4" />,
    //   roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR],
    // },
    // {
    //   name: 'API Configuration',
    //   path: '/settings/api',
    //   icon: <Globe className="w-4 h-4" />,
    //   roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    // },
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

        {/* Settings with submenu */}
        <li>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={cn(
              'flex w-full items-center gap-3 px-3 py-2 rounded-md transition-all duration-200',
              location.pathname.startsWith('/settings') || location.pathname === '/users' 
                ? 'bg-school-100 text-school-700 font-medium' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent',
              collapsed && 'justify-center px-2'
            )}
          >
            <span className={cn(
              "transition-transform",
              (location.pathname.startsWith('/settings') || location.pathname === '/users') && "text-school-600"
            )}>
              <Settings className="w-5 h-5" />
            </span>
            {!collapsed && (
              <>
                <span className="animate-fade-in flex-1">Settings</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-4 h-4 transition-transform ${settingsOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </>
            )}
          </button>
          
          {/* Settings submenu */}
          {!collapsed && settingsOpen && (
            <ul className="mt-1 ml-6 space-y-1 border-l border-sidebar-border pl-2">
              {settingsSubItems.map((subItem) => {
                const isActive = location.pathname === subItem.path;
                return (
                  <li key={subItem.path}>
                    <Link
                      to={subItem.path}
                      onClick={closeMobileSidebar}
                      className={cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 text-sm',
                        isActive 
                          ? 'bg-school-100 text-school-700 font-medium' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent'
                      )}
                    >
                      <span className={cn(
                        "transition-transform",
                        isActive && "text-school-600"
                      )}>
                        {subItem.icon}
                      </span>
                      <span className="animate-fade-in">{subItem.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

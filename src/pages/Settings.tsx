import React, { useState, createContext, useContext } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Cog, Bell, Shield, FileText, School, Users, PanelLeft, GraduationCap, Globe, Palette
} from 'lucide-react';

export const SystemSettingsContext = createContext({
  systemName: 'Alicia MIS',
  updateSystemName: (name: string) => {},
  logo: '',
  updateLogo: (logo: string) => {},
  theme: 'light',
  updateTheme: (theme: 'light' | 'dark' | 'system') => {},
  primaryColor: 'blue',
  updatePrimaryColor: (color: string) => {}
});

export const useSystemSettings = () => useContext(SystemSettingsContext);

export const SystemSettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [systemName, setSystemName] = useState('Alicia MIS');
  const [logo, setLogo] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [primaryColor, setPrimaryColor] = useState('blue');
  
  const updateSystemName = (name: string) => {
    setSystemName(name);
    localStorage.setItem('systemName', name);
  };

  const updateLogo = (logoUrl: string) => {
    setLogo(logoUrl);
    localStorage.setItem('schoolLogo', logoUrl);
  };
  
  const updateTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };
  
  const updatePrimaryColor = (color: string) => {
    setPrimaryColor(color);
    localStorage.setItem('primaryColor', color);
  };
  
  React.useEffect(() => {
    const savedName = localStorage.getItem('systemName');
    const savedLogo = localStorage.getItem('schoolLogo');
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    
    if (savedName) {
      setSystemName(savedName);
    }
    if (savedLogo) {
      setLogo(savedLogo);
    }
    if (savedTheme) {
      setTheme(savedTheme);
      updateTheme(savedTheme); // Apply theme on load
    }
    if (savedPrimaryColor) {
      setPrimaryColor(savedPrimaryColor);
    }
    
    // Add listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  return (
    <SystemSettingsContext.Provider value={{ 
      systemName, 
      updateSystemName, 
      logo, 
      updateLogo,
      theme,
      updateTheme,
      primaryColor,
      updatePrimaryColor
    }}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

const SettingsPage = () => {
  const navigate = useNavigate();
  
  const settingsModules = [
    {
      title: "School Settings",
      description: "Configure your school information and preferences",
      icon: <School className="h-8 w-8 text-school-600" />,
      path: "/settings/school"
    },
    {
      title: "Theme Settings",
      description: "Customize the look and feel of your application",
      icon: <Palette className="h-8 w-8 text-purple-600" />,
      path: "/settings/theme"
    },
    {
      title: "Grade Levels",
      description: "Manage grade levels used throughout the system",
      icon: <GraduationCap className="h-8 w-8 text-green-600" />,
      path: "/settings/grade-levels"
    },
    {
      title: "Notifications",
      description: "Configure how and when notifications are sent",
      icon: <Bell className="h-8 w-8 text-amber-600" />,
      path: "/settings/notifications"
    },
    {
      title: "Security",
      description: "Manage security preferences for your school system",
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      path: "/settings/security"
    },
    {
      title: "Document Requirements",
      description: "Manage document requirements for student enrollment",
      icon: <FileText className="h-8 w-8 text-emerald-600" />,
      path: "/settings/documents"
    },
    {
      title: "Sections",
      description: "Manage class sections and their assignments",
      icon: <PanelLeft className="h-8 w-8 text-orange-600" />,
      path: "/settings/sections"
    },
    {
      title: "API Configuration",
      description: "Configure mock data vs real API connectivity",
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      path: "/settings/api"
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: <Users className="h-8 w-8 text-purple-600" />,
      path: "/settings/users"
    },
  ];

  return (
    <MainLayout>
      <PageHeader 
        title="Settings" 
        description="Configure and manage system settings"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsModules.map((module) => (
          <Card key={module.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              {module.icon}
              <div>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => navigate(module.path)}
              >
                Open Settings
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};

export default SettingsPage;


import React, { createContext, useContext, useEffect } from 'react';
import { useSystemSettings } from '@/pages/Settings';

interface ThemeContextType {
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({ isDarkMode: false });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, primaryColor } = useSystemSettings();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  useEffect(() => {
    // Apply theme based on settings
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
      setIsDarkMode(prefersDark);
      
      // Add listener for system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', e.matches);
        setIsDarkMode(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Apply primary color via CSS variables
  useEffect(() => {
    // Define color mappings
    const colorMappings: Record<string, string> = {
      blue: '210 100% 45%',
      green: '142 76% 36%',
      purple: '262 83% 58%',
      red: '0 84% 60%',
      orange: '24 95% 53%',
      teal: '173 80% 40%',
      pink: '336 80% 58%',
      indigo: '245 79% 52%'
    };

    // Update CSS variables
    if (colorMappings[primaryColor]) {
      document.documentElement.style.setProperty('--primary', colorMappings[primaryColor]);
    }
  }, [primaryColor]);

  return (
    <ThemeContext.Provider value={{ isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

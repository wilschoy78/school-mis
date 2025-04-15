
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SystemSettingsProvider } from "./pages/Settings";
import { GradeLevelsProvider } from "./pages/settings/SettingsGradeLevels";
import { ApiProvider } from "./context/ApiContext";
import { EventProvider } from "./context/EventContext";
import ThemeProvider from "./components/ThemeProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Enrollment from "./pages/Enrollment";
import Accounts from "./pages/Accounts";
import Employees from "./pages/Employees";
import Library from "./pages/Library";
import Settings from "./pages/Settings";
import SettingsSchool from "./pages/settings/SettingsSchool";
import SettingsTheme from "./pages/settings/SettingsTheme";
import SettingsNotifications from "./pages/settings/SettingsNotifications";
import SettingsSecurity from "./pages/settings/SettingsSecurity";
import SettingsDocuments from "./pages/settings/SettingsDocuments";
import SettingsSections from "./pages/settings/SettingsSections";
import SettingsGradeLevels from "./pages/settings/SettingsGradeLevels";
import SettingsApi from "./pages/settings/SettingsApi";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import { useState } from 'react';

const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ApiProvider>
          <SystemSettingsProvider>
            <ThemeProvider>
              <GradeLevelsProvider>
                <AuthProvider>
                  <EventProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/enrollment" element={<Enrollment />} />
                        <Route path="/accounts" element={<Accounts />} />
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/settings/school" element={<SettingsSchool />} />
                        <Route path="/settings/theme" element={<SettingsTheme />} />
                        <Route path="/settings/notifications" element={<SettingsNotifications />} />
                        <Route path="/settings/security" element={<SettingsSecurity />} />
                        <Route path="/settings/documents" element={<SettingsDocuments />} />
                        <Route path="/settings/sections" element={<SettingsSections />} />
                        <Route path="/settings/grade-levels" element={<SettingsGradeLevels />} />
                        <Route path="/settings/api" element={<SettingsApi />} />
                        <Route path="/settings/users" element={<Navigate to="/users" replace />} />
                        <Route path="/users" element={<Users />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </BrowserRouter>
                  </EventProvider>
                </AuthProvider>
              </GradeLevelsProvider>
            </ThemeProvider>
          </SystemSettingsProvider>
        </ApiProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

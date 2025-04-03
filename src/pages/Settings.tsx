
import React, { useState, useRef } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Building, Mail, Phone, Globe, MapPin, CalendarIcon, Clock, Wallet, Palette, Image, Upload } from 'lucide-react';

export const SystemSettingsContext = React.createContext({
  systemName: 'Alicia MIS',
  updateSystemName: (name: string) => {},
  logo: '',
  updateLogo: (logo: string) => {}
});

export const useSystemSettings = () => React.useContext(SystemSettingsContext);

export const SystemSettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [systemName, setSystemName] = useState('Alicia MIS');
  const [logo, setLogo] = useState('');
  
  const updateSystemName = (name: string) => {
    setSystemName(name);
    localStorage.setItem('systemName', name);
  };

  const updateLogo = (logoUrl: string) => {
    setLogo(logoUrl);
    localStorage.setItem('schoolLogo', logoUrl);
  };
  
  React.useEffect(() => {
    const savedName = localStorage.getItem('systemName');
    const savedLogo = localStorage.getItem('schoolLogo');
    if (savedName) {
      setSystemName(savedName);
    }
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);
  
  return (
    <SystemSettingsContext.Provider value={{ systemName, updateSystemName, logo, updateLogo }}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

const SettingsPage = () => {
  const { systemName, updateSystemName, logo, updateLogo } = useSystemSettings();
  const [schoolSettings, setSchoolSettings] = useState({
    name: 'Brightstar International School',
    shortName: 'Brightstar',
    email: 'info@brightstar.edu',
    phone: '555-123-4567',
    address: '123 Education Way, Knowledge City, 12345',
    website: 'www.brightstar.edu',
    logo: logo,
    systemName: systemName,
    theme: 'light',
    academicYear: '2023-2024',
    timezone: 'UTC-5',
    currency: 'USD'
  });

  // Initialize notificationSettings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    attendanceAlerts: true,
    feeReminders: true,
    examResults: true,
    holidayAnnouncements: true,
    newsletterUpdates: false
  });

  // Initialize securitySettings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: 90,
    sessionTimeout: 30,
    loginAttempts: 5
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(logo || null);

  const { toast } = useToast();

  const handleSchoolSettingsChange = (e) => {
    const { name, value } = e.target;
    setSchoolSettings(prev => ({ ...prev, [name]: value }));
    
    if (name === 'systemName') {
      updateSystemName(value);
    }
  };

  const handleSelectChange = (name, value) => {
    setSchoolSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewLogo(result);
        setSchoolSettings(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerLogoUpload = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = () => {
    setPreviewLogo(null);
    setSchoolSettings(prev => ({ ...prev, logo: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveSchoolSettings = () => {
    updateSystemName(schoolSettings.systemName);
    updateLogo(schoolSettings.logo);
    toast({
      title: "Settings Saved",
      description: "School settings have been updated successfully."
    });
  };

  const handleNotificationToggle = (name) => {
    setNotificationSettings(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSecuritySettingsChange = (e) => {
    const { name, value } = e.target;
    setSecuritySettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityToggle = (name) => {
    setSecuritySettings(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Notification preferences have been updated successfully."
    });
  };

  const saveSecuritySettings = () => {
    toast({
      title: "Settings Saved",
      description: "Security settings have been updated successfully."
    });
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Settings" 
        description="Configure system settings and preferences"
      />

      <Tabs defaultValue="school" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="school">School</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>
                Manage your school details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="name">School Name</Label>
                  </div>
                  <Input 
                    id="name" 
                    name="name"
                    value={schoolSettings.name} 
                    onChange={handleSchoolSettingsChange} 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="shortName">Short Name</Label>
                  </div>
                  <Input 
                    id="shortName" 
                    name="shortName"
                    value={schoolSettings.shortName} 
                    onChange={handleSchoolSettingsChange} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="systemName">System Name</Label>
                  </div>
                  <Input 
                    id="systemName" 
                    name="systemName"
                    value={schoolSettings.systemName} 
                    onChange={handleSchoolSettingsChange} 
                    placeholder="e.g., Alicia MIS"
                  />
                  <p className="text-xs text-muted-foreground">This name appears in the sidebar and throughout the system</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email">Email Address</Label>
                  </div>
                  <Input 
                    id="email" 
                    name="email"
                    type="email"
                    value={schoolSettings.email} 
                    onChange={handleSchoolSettingsChange} 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  <Label>School Logo</Label>
                </div>
                <div className="flex flex-col gap-4 items-start">
                  <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center overflow-hidden bg-gray-50">
                    {previewLogo ? (
                      <img 
                        src={previewLogo} 
                        alt="School Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-gray-500">
                        <Upload className="h-8 w-8 mb-2" />
                        <p className="text-xs text-center">No logo uploaded</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={triggerLogoUpload}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    {previewLogo && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={removeLogo}
                      >
                        Remove Logo
                      </Button>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 512x512 pixels. Max file size: 2MB. 
                    Supported formats: JPG, PNG, SVG.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="phone">Phone Number</Label>
                </div>
                <Input 
                  id="phone" 
                  name="phone"
                  value={schoolSettings.phone} 
                  onChange={handleSchoolSettingsChange} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="address">Address</Label>
                </div>
                <Input 
                  id="address" 
                  name="address"
                  value={schoolSettings.address} 
                  onChange={handleSchoolSettingsChange} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="website">Website</Label>
                </div>
                <Input 
                  id="website" 
                  name="website"
                  value={schoolSettings.website} 
                  onChange={handleSchoolSettingsChange} 
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="academicYear">Current Academic Year</Label>
                  </div>
                  <Select 
                    value={schoolSettings.academicYear} 
                    onValueChange={(value) => handleSelectChange('academicYear', value)}
                  >
                    <SelectTrigger id="academicYear">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2022-2023">2022-2023</SelectItem>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="timezone">Timezone</Label>
                  </div>
                  <Select 
                    value={schoolSettings.timezone} 
                    onValueChange={(value) => handleSelectChange('timezone', value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                      <SelectItem value="UTC+5:30">Indian Standard Time (UTC+5:30)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="currency">Currency</Label>
                  </div>
                  <Select 
                    value={schoolSettings.currency} 
                    onValueChange={(value) => handleSelectChange('currency', value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (C$)</SelectItem>
                      <SelectItem value="AUD">Australian Dollar (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="theme">Theme</Label>
                </div>
                <Select 
                  value={schoolSettings.theme} 
                  onValueChange={(value) => handleSelectChange('theme', value)}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSchoolSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications" className="font-medium">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <Switch 
                    id="smsNotifications" 
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={() => handleNotificationToggle('smsNotifications')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="attendanceAlerts" className="font-medium">Attendance Alerts</Label>
                    <p className="text-sm text-gray-500">Alerts for student attendance</p>
                  </div>
                  <Switch 
                    id="attendanceAlerts" 
                    checked={notificationSettings.attendanceAlerts}
                    onCheckedChange={() => handleNotificationToggle('attendanceAlerts')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="feeReminders" className="font-medium">Fee Reminders</Label>
                    <p className="text-sm text-gray-500">Reminders for upcoming and overdue fees</p>
                  </div>
                  <Switch 
                    id="feeReminders" 
                    checked={notificationSettings.feeReminders}
                    onCheckedChange={() => handleNotificationToggle('feeReminders')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="examResults" className="font-medium">Exam Results</Label>
                    <p className="text-sm text-gray-500">Notifications when exam results are published</p>
                  </div>
                  <Switch 
                    id="examResults" 
                    checked={notificationSettings.examResults}
                    onCheckedChange={() => handleNotificationToggle('examResults')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="holidayAnnouncements" className="font-medium">Holiday Announcements</Label>
                    <p className="text-sm text-gray-500">Announcements about upcoming holidays</p>
                  </div>
                  <Switch 
                    id="holidayAnnouncements" 
                    checked={notificationSettings.holidayAnnouncements}
                    onCheckedChange={() => handleNotificationToggle('holidayAnnouncements')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newsletterUpdates" className="font-medium">Newsletter Updates</Label>
                    <p className="text-sm text-gray-500">Monthly newsletter and updates</p>
                  </div>
                  <Switch 
                    id="newsletterUpdates" 
                    checked={notificationSettings.newsletterUpdates}
                    onCheckedChange={() => handleNotificationToggle('newsletterUpdates')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveNotificationSettings}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage security preferences for your school system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth" className="font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
                </div>
                <Switch 
                  id="twoFactorAuth" 
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={() => handleSecurityToggle('twoFactorAuth')}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input 
                  id="passwordExpiry" 
                  name="passwordExpiry"
                  type="number"
                  value={securitySettings.passwordExpiry} 
                  onChange={handleSecuritySettingsChange} 
                />
                <p className="text-sm text-gray-500">Number of days before passwords expire</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input 
                  id="sessionTimeout" 
                  name="sessionTimeout"
                  type="number"
                  value={securitySettings.sessionTimeout} 
                  onChange={handleSecuritySettingsChange} 
                />
                <p className="text-sm text-gray-500">Auto logout after inactivity</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loginAttempts">Failed Login Attempts</Label>
                <Input 
                  id="loginAttempts" 
                  name="loginAttempts"
                  type="number"
                  value={securitySettings.loginAttempts} 
                  onChange={handleSecuritySettingsChange} 
                />
                <p className="text-sm text-gray-500">Maximum failed attempts before account lockout</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSecuritySettings}>Save Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default SettingsPage;

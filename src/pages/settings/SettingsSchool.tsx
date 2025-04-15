import React, { useState, useRef } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Building, Mail, Phone, Globe, MapPin, CalendarIcon, Clock, Wallet, Palette, Image, Upload, ArrowRight } from 'lucide-react';
import { useSystemSettings } from '../Settings';
import { Link } from 'react-router-dom';

const SettingsSchool = () => {
  const { systemName, updateSystemName, logo, updateLogo, theme } = useSystemSettings();
  const [schoolSettings, setSchoolSettings] = useState({
    name: 'Brightstar International School',
    shortName: 'Brightstar',
    email: 'info@brightstar.edu',
    phone: '555-123-4567',
    address: '123 Education Way, Knowledge City, 12345',
    website: 'www.brightstar.edu',
    logo: logo,
    systemName: systemName,
    theme: theme,
    academicYear: '2023-2024',
    timezone: 'UTC+8',
    currency: 'PHP'
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

  return (
    <MainLayout>
      <PageHeader 
        title="School Settings" 
        description="Configure your school information and preferences"
      />

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
                <Palette className="h-4 w-4 text-muted-foreground" />
                <Label>Theme Settings</Label>
              </div>
              <div className="h-10 flex items-center">
                <Link 
                  to="/settings/theme"
                  className="text-primary hover:underline flex items-center"
                >
                  Customize application theme and appearance
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
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
                  <SelectItem value="UTC+8">Philippines Time (GMT+8)</SelectItem>
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
                  <SelectItem value="PHP">Philippine Peso (₱)</SelectItem>
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
    </MainLayout>
  );
};

export default SettingsSchool;

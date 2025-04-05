
import React, { useState } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const SettingsSecurity = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: 90,
    sessionTimeout: 30,
    loginAttempts: 5
  });

  const { toast } = useToast();

  const handleSecuritySettingsChange = (e) => {
    const { name, value } = e.target;
    setSecuritySettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityToggle = (name) => {
    setSecuritySettings(prev => ({ ...prev, [name]: !prev[name] }));
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
        title="Security Settings" 
        description="Manage security preferences for your school system"
      />

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
    </MainLayout>
  );
};

export default SettingsSecurity;


import React, { useState } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const SettingsNotifications = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    attendanceAlerts: true,
    feeReminders: true,
    examResults: true,
    holidayAnnouncements: true,
    newsletterUpdates: false
  });

  const { toast } = useToast();

  const handleNotificationToggle = (name) => {
    setNotificationSettings(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Notification preferences have been updated successfully."
    });
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Notification Settings" 
        description="Configure how and when you receive notifications"
      />

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
    </MainLayout>
  );
};

export default SettingsNotifications;


import React from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Palette, Sun, Moon, Monitor, Check, ArrowRight, Circle, RefreshCcw, 
} from 'lucide-react';
import { useSystemSettings } from '../Settings';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

const SettingsTheme = () => {
  const { 
    theme, 
    updateTheme, 
    primaryColor, 
    updatePrimaryColor 
  } = useSystemSettings();
  
  const { toast } = useToast();

  const handleThemeChange = (value: string) => {
    if (value === 'light' || value === 'dark' || value === 'system') {
      updateTheme(value);
    }
  };

  const handleColorChange = (color: string) => {
    updatePrimaryColor(color);
  };

  const saveThemeSettings = () => {
    toast({
      title: "Theme Settings Saved",
      description: "Your theme settings have been updated successfully."
    });
  };

  const colorOptions = [
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Green', value: 'green', class: 'bg-green-500' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
    { name: 'Red', value: 'red', class: 'bg-red-500' },
    { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
    { name: 'Teal', value: 'teal', class: 'bg-teal-500' },
    { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
    { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
  ];

  const resetToDefaults = () => {
    updateTheme('light');
    updatePrimaryColor('blue');
    toast({
      title: "Defaults Restored",
      description: "Theme settings have been reset to defaults."
    });
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Theme Settings" 
        description="Customize the look and feel of your application"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Appearance
              </CardTitle>
              <CardDescription>
                Customize the visual appearance of your school management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Color Mode</Label>
                <ToggleGroup 
                  type="single" 
                  value={theme} 
                  onValueChange={handleThemeChange}
                  className="justify-start"
                >
                  <ToggleGroupItem value="light" className="flex gap-2 items-center">
                    <Sun className="h-4 w-4" />
                    Light
                  </ToggleGroupItem>
                  <ToggleGroupItem value="dark" className="flex gap-2 items-center">
                    <Moon className="h-4 w-4" />
                    Dark
                  </ToggleGroupItem>
                  <ToggleGroupItem value="system" className="flex gap-2 items-center">
                    <Monitor className="h-4 w-4" />
                    System
                  </ToggleGroupItem>
                </ToggleGroup>
                <p className="text-sm text-muted-foreground mt-2">
                  Choose how your application looks. System will follow your device preferences.
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Primary Color</Label>
                <div className="grid grid-cols-4 gap-3">
                  {colorOptions.map((color) => (
                    <Button
                      key={color.value}
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-14 w-full rounded-md border border-input flex flex-col items-center justify-center gap-1.5 p-1",
                        primaryColor === color.value && "border-2 border-primary"
                      )}
                      onClick={() => handleColorChange(color.value)}
                    >
                      <div className={cn("h-6 w-6 rounded-full flex items-center justify-center", color.class)}>
                        {primaryColor === color.value && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="text-xs">{color.name}</span>
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Select a primary color for buttons, links and interactive elements.
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="animations">Enable Animations</Label>
                  <Switch id="animations" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Toggle animations for a more dynamic user experience.
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="compact">Compact Mode</Label>
                  <Switch id="compact" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Use less spacing between elements for a more compact interface.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetToDefaults} className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={saveThemeSettings} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Theme Preview</CardTitle>
              <CardDescription>
                See how your theme choices look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "border rounded-md p-4 transition-colors duration-200",
                theme === 'dark' ? 'bg-card border-border' : 'bg-background'
              )}>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Preview</h3>
                  <div className="space-y-2">
                    <Button className={cn(
                      primaryColor === 'blue' && 'bg-blue-500 hover:bg-blue-600',
                      primaryColor === 'green' && 'bg-green-500 hover:bg-green-600',
                      primaryColor === 'purple' && 'bg-purple-500 hover:bg-purple-600',
                      primaryColor === 'red' && 'bg-red-500 hover:bg-red-600',
                      primaryColor === 'orange' && 'bg-orange-500 hover:bg-orange-600',
                      primaryColor === 'teal' && 'bg-teal-500 hover:bg-teal-600',
                      primaryColor === 'pink' && 'bg-pink-500 hover:bg-pink-600',
                      primaryColor === 'indigo' && 'bg-indigo-500 hover:bg-indigo-600'
                    )}>
                      Primary Button
                    </Button>
                    <Button variant="outline">Secondary Button</Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Text Sample</p>
                    <p className="text-sm text-muted-foreground">Muted text sample</p>
                    <a href="#" className={cn(
                      "text-sm underline",
                      primaryColor === 'blue' && 'text-blue-500',
                      primaryColor === 'green' && 'text-green-500',
                      primaryColor === 'purple' && 'text-purple-500',
                      primaryColor === 'red' && 'text-red-500',
                      primaryColor === 'orange' && 'text-orange-500',
                      primaryColor === 'teal' && 'text-teal-500',
                      primaryColor === 'pink' && 'text-pink-500',
                      primaryColor === 'indigo' && 'text-indigo-500'
                    )}>
                      Link Text
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsTheme;


import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useApi } from '@/context/ApiContext';
import { toast } from '@/components/ui/use-toast';
import { Shield, Server, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SettingsApi = () => {
  const { 
    apiMode, 
    setApiMode, 
    apiBaseUrl, 
    setApiBaseUrl,
    connectionStatus,
    checkConnection,
    lastChecked
  } = useApi();
  const [tempBaseUrl, setTempBaseUrl] = useState(apiBaseUrl);
  const [isChecking, setIsChecking] = useState(false);
  
  useEffect(() => {
    if (apiBaseUrl !== tempBaseUrl) {
      setTempBaseUrl(apiBaseUrl);
    }
  }, [apiBaseUrl]);
  
  const handleSave = () => {
    setApiBaseUrl(tempBaseUrl);
    toast({
      title: "API Settings Updated",
      description: `API mode set to ${apiMode} with base URL ${tempBaseUrl || 'not set'}`,
    });
  };
  
  const handleCheckConnection = async () => {
    setIsChecking(true);
    const isConnected = await checkConnection();
    setIsChecking(false);
    
    toast({
      title: isConnected ? "Connection Successful" : "Connection Failed",
      description: isConnected 
        ? "Successfully connected to API" 
        : "Could not connect to the API. Please check the URL and ensure the API is running.",
      variant: isConnected ? "default" : "destructive"
    });
  };
  
  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Connected</Badge>;
      case 'checking':
        return <Badge className="bg-amber-500 hover:bg-amber-600"><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Checking</Badge>;
      default:
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Disconnected</Badge>;
    }
  };
  
  return (
    <MainLayout>
      <PageHeader 
        title="API Settings" 
        description="Configure how your application connects to backend services"
      />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Data Source Configuration</CardTitle>
                <CardDescription>
                  Choose between mock data or real API endpoints
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                {getConnectionStatusBadge()}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="api-toggle">Use Real API</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between mock data and real API endpoints
                </p>
              </div>
              <Switch 
                id="api-toggle"
                checked={apiMode === 'real'}
                onCheckedChange={(checked) => {
                  setApiMode(checked ? 'real' : 'mock');
                  toast({
                    title: "Data Source Changed",
                    description: `Now using ${checked ? 'real API' : 'mock data'}`,
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-base-url">API Base URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="api-base-url" 
                  placeholder="https://api.example.com/v1"
                  value={tempBaseUrl}
                  onChange={(e) => setTempBaseUrl(e.target.value)}
                  disabled={apiMode === 'mock'}
                  className="flex-1"
                />
                <Button 
                  onClick={handleCheckConnection} 
                  disabled={apiMode === 'mock' || !tempBaseUrl || isChecking}
                  variant="outline"
                >
                  {isChecking ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : 'Test Connection'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {apiMode === 'mock' 
                  ? "This field is disabled while using mock data." 
                  : "Enter the base URL for your API endpoints"}
              </p>
            </div>
            
            <Button onClick={handleSave} disabled={apiMode === 'mock'}>
              Save API Configuration
            </Button>
          </CardContent>
          <CardFooter className="bg-muted/50 border-t">
            <div className="flex justify-between w-full text-sm text-muted-foreground">
              <span>Last connection check:</span>
              <span>{lastChecked ? format(lastChecked, 'PPpp') : 'Never'}</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>API Status</CardTitle>
            <CardDescription>
              Current status and configuration of your API connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Current Data Source:</span>
              <span className={apiMode === 'real' ? 'text-green-600' : 'text-amber-600'}>
                {apiMode === 'real' ? 'Real API' : 'Mock Data'}
              </span>
            </div>
            
            {apiMode === 'real' && (
              <>
                <div className="flex justify-between">
                  <span className="font-medium">Base URL:</span>
                  <span>{apiBaseUrl || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Connection Status:</span>
                  <span>{getConnectionStatusBadge()}</span>
                </div>
              </>
            )}
            
            <div className="mt-4 p-3 bg-muted rounded-md">
              <h4 className="font-medium mb-2">How to use the API services:</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The application now includes service hooks for API integration:
              </p>
              <pre className="mt-2 p-2 bg-black text-white rounded text-xs overflow-x-auto">
                {`// Example: Using the student service in a component
import { useStudentService } from '@/services/studentService';

function StudentList() {
  const { useStudents } = useStudentService();
  const { data, isLoading, error } = useStudents();
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <ul>
      {data?.map(student => (
        <li key={student.id}>{student.firstName} {student.lastName}</li>
      ))}
    </ul>
  );
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <CardTitle>Available API Services</CardTitle>
            </div>
            <CardDescription>
              Ready-to-use API services for your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 pb-3 border-b">
                <div className="mt-1 bg-primary/10 p-1.5 rounded-md">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Authentication Service</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Handles user login, logout, and token management. Import from <code>@/services/authService</code>.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 pb-3 border-b">
                <div className="mt-1 bg-primary/10 p-1.5 rounded-md">
                  <Server className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Student Service</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Provides CRUD operations for student management. Import from <code>@/services/studentService</code>.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-1.5 rounded-md">
                  <Server className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Event Service</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Handles school events and calendar functionality. Import from <code>@/services/eventService</code>.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SettingsApi;

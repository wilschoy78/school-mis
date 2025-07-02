
import React, { useState } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
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

const SettingsApi = () => {
  const { apiMode, setApiMode, apiBaseUrl, setApiBaseUrl } = useApi();
  const [tempBaseUrl, setTempBaseUrl] = useState(apiBaseUrl);
  
  const handleSave = () => {
    setApiBaseUrl(tempBaseUrl);
    toast({
      title: "API Settings Updated",
      description: `API mode set to ${apiMode} with base URL ${tempBaseUrl || 'not set'}`,
    });
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
            <CardTitle>Data Source Configuration</CardTitle>
            <CardDescription>
              Choose between mock data or real API endpoints
            </CardDescription>
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
              <Input 
                id="api-base-url" 
                placeholder="https://api.example.com/v1"
                value={tempBaseUrl}
                onChange={(e) => setTempBaseUrl(e.target.value)}
                disabled={apiMode === 'mock'}
              />
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
              <div className="flex justify-between">
                <span className="font-medium">Base URL:</span>
                <span>{apiBaseUrl || 'Not set'}</span>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-muted rounded-md">
              <h4 className="font-medium mb-2">How to use:</h4>
              <p className="text-sm text-muted-foreground">
                When implementing API calls in your components, use the <code>useApi</code> hook to check the current mode:
              </p>
              <pre className="mt-2 p-2 bg-black text-white rounded text-xs overflow-x-auto">
                {`import { useApi } from '@/context/ApiContext';

// Inside your component
const { apiMode, apiBaseUrl } = useApi();

// Conditional data fetching
const fetchData = async () => {
  if (apiMode === 'mock') {
    return mockData;
  } else {
    return fetch(\`\${apiBaseUrl}/endpoint\`).then(res => res.json());
  }
};`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SettingsApi;

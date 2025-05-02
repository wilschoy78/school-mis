
import React, { createContext, useContext, useState, useEffect } from 'react';

type ApiMode = 'mock' | 'real';
type ConnectionStatus = 'connected' | 'disconnected' | 'checking';

interface ApiContextType {
  apiMode: ApiMode;
  setApiMode: (mode: ApiMode) => void;
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
  connectionStatus: ConnectionStatus;
  checkConnection: () => Promise<boolean>;
  lastChecked: Date | null;
}

const defaultContext: ApiContextType = {
  apiMode: 'mock',
  setApiMode: () => {},
  apiBaseUrl: '',
  setApiBaseUrl: () => {},
  connectionStatus: 'disconnected',
  checkConnection: async () => false,
  lastChecked: null
};

const ApiContext = createContext<ApiContextType>(defaultContext);

export const useApi = () => useContext(ApiContext);

export const ApiProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [apiMode, setApiMode] = useState<ApiMode>('mock');
  const [apiBaseUrl, setApiBaseUrl] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  // Load stored preferences from localStorage on component mount
  useEffect(() => {
    const storedMode = localStorage.getItem('apiMode') as ApiMode | null;
    const storedBaseUrl = localStorage.getItem('apiBaseUrl');
    
    if (storedMode) {
      setApiMode(storedMode);
    }
    
    if (storedBaseUrl) {
      setApiBaseUrl(storedBaseUrl);
    }
  }, []);
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('apiMode', apiMode);
  }, [apiMode]);
  
  useEffect(() => {
    localStorage.setItem('apiBaseUrl', apiBaseUrl);
  }, [apiBaseUrl]);
  
  // Check connection when apiMode or apiBaseUrl changes
  useEffect(() => {
    if (apiMode === 'real' && apiBaseUrl) {
      checkConnection();
    } else if (apiMode === 'mock') {
      setConnectionStatus('connected');
      setLastChecked(new Date());
    } else {
      setConnectionStatus('disconnected');
    }
  }, [apiMode, apiBaseUrl]);
  
  const checkConnection = async (): Promise<boolean> => {
    if (apiMode === 'mock') {
      setConnectionStatus('connected');
      setLastChecked(new Date());
      return true;
    }
    
    if (!apiBaseUrl) {
      setConnectionStatus('disconnected');
      setLastChecked(new Date());
      return false;
    }
    
    setConnectionStatus('checking');
    
    try {
      // Try to connect to /health or a similar endpoint
      const response = await fetch(`${apiBaseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Short timeout to avoid long waits
        signal: AbortSignal.timeout(3000)
      });
      
      const isConnected = response.ok;
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      setLastChecked(new Date());
      return isConnected;
    } catch (error) {
      console.error('API connection check failed:', error);
      setConnectionStatus('disconnected');
      setLastChecked(new Date());
      return false;
    }
  };
  
  return (
    <ApiContext.Provider value={{ 
      apiMode, 
      setApiMode, 
      apiBaseUrl, 
      setApiBaseUrl,
      connectionStatus,
      checkConnection,
      lastChecked
    }}>
      {children}
    </ApiContext.Provider>
  );
};

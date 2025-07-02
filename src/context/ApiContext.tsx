
import React, { createContext, useContext, useState, useEffect } from 'react';

type ApiMode = 'mock' | 'real';

interface ApiContextType {
  apiMode: ApiMode;
  setApiMode: (mode: ApiMode) => void;
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
}

const defaultContext: ApiContextType = {
  apiMode: 'mock',
  setApiMode: () => {},
  apiBaseUrl: '',
  setApiBaseUrl: () => {},
};

const ApiContext = createContext<ApiContextType>(defaultContext);

export const useApi = () => useContext(ApiContext);

export const ApiProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [apiMode, setApiMode] = useState<ApiMode>('mock');
  const [apiBaseUrl, setApiBaseUrl] = useState<string>('');
  
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
  
  return (
    <ApiContext.Provider value={{ apiMode, setApiMode, apiBaseUrl, setApiBaseUrl }}>
      {children}
    </ApiContext.Provider>
  );
};

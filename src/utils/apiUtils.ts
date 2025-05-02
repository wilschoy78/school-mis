
import { useApi } from "@/context/ApiContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Types for API responses
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// Base API options
export interface ApiOptions {
  headers?: Record<string, string>;
  requireAuth?: boolean;
  mockData?: any;
  mockDelay?: number;
}

// Generic fetch function with type safety
export const useApiService = () => {
  const { apiMode, apiBaseUrl } = useApi();
  const { user } = useAuth();
  const { toast } = useToast();

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (user) {
      // Add authentication token if available
      // Replace with your actual auth token format
      headers['Authorization'] = `Bearer ${user.id}`;
    }
    
    return headers;
  };

  const handleApiError = (error: any, endpoint: string) => {
    console.error(`API Error (${endpoint}):`, error);
    toast({
      title: "API Error",
      description: error.message || "Failed to connect to API",
      variant: "destructive",
    });
    
    return {
      data: null,
      error: error.message || "An unknown error occurred",
      status: 500
    };
  };

  const fetchData = async <T>(
    endpoint: string, 
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    const {
      headers = {},
      requireAuth = false,
      mockData = null,
      mockDelay = 300
    } = options;
    
    // Use mock data if in mock mode or apiBaseUrl isn't set
    if (apiMode === 'mock' || !apiBaseUrl) {
      if (mockData === null) {
        return {
          data: null,
          error: "No mock data provided for this endpoint",
          status: 404
        };
      }
      
      // Return mock data with a simulated delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: mockData as T,
            error: null,
            status: 200
          });
        }, mockDelay);
      });
    }
    
    try {
      // Prepare headers
      const requestHeaders = {
        ...headers,
        ...(requireAuth ? getAuthHeaders() : {})
      };
      
      // Make the actual API call
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        headers: requestHeaders
      });
      
      // Handle HTTP errors
      if (!response.ok) {
        let errorMessage = `API Error: ${response.status}`;
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Couldn't parse error JSON, use default message
        }
        
        return {
          data: null,
          error: errorMessage,
          status: response.status
        };
      }
      
      // Parse successful response
      const data = await response.json();
      
      return {
        data,
        error: null,
        status: response.status
      };
    } catch (error: any) {
      return handleApiError(error, endpoint);
    }
  };
  
  // HTTP Methods
  const get = async <T>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> => {
    return fetchData<T>(endpoint, options);
  };
  
  const post = async <T>(endpoint: string, body: any, options: ApiOptions = {}): Promise<ApiResponse<T>> => {
    try {
      if (apiMode === 'mock') {
        return {
          data: options.mockData as T || null,
          error: null,
          status: 201
        };
      }
      
      const headers = {
        ...(options.requireAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' })
      };
      
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          data: null,
          error: errorData.message || `API Error: ${response.status}`,
          status: response.status
        };
      }
      
      const data = await response.json();
      return {
        data,
        error: null,
        status: response.status
      };
    } catch (error: any) {
      return handleApiError(error, endpoint);
    }
  };
  
  const put = async <T>(endpoint: string, body: any, options: ApiOptions = {}): Promise<ApiResponse<T>> => {
    try {
      if (apiMode === 'mock') {
        return {
          data: options.mockData as T || null,
          error: null,
          status: 200
        };
      }
      
      const headers = {
        ...(options.requireAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' })
      };
      
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          data: null,
          error: errorData.message || `API Error: ${response.status}`,
          status: response.status
        };
      }
      
      const data = await response.json();
      return {
        data,
        error: null,
        status: response.status
      };
    } catch (error: any) {
      return handleApiError(error, endpoint);
    }
  };
  
  const remove = async <T>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> => {
    try {
      if (apiMode === 'mock') {
        return {
          data: options.mockData as T || null,
          error: null,
          status: 200
        };
      }
      
      const headers = {
        ...(options.requireAuth ? getAuthHeaders() : {})
      };
      
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          data: null,
          error: errorData.message || `API Error: ${response.status}`,
          status: response.status
        };
      }
      
      const data = await response.json();
      return {
        data,
        error: null,
        status: response.status
      };
    } catch (error: any) {
      return handleApiError(error, endpoint);
    }
  };
  
  return {
    get,
    post,
    put,
    remove,
    apiMode,
    apiBaseUrl
  };
};

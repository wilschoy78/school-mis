
import { useApi } from "@/context/ApiContext";

// Example of how to use the API context in a data fetching function
export const useApiData = <T,>(endpoint: string, mockData: T) => {
  const { apiMode, apiBaseUrl } = useApi();
  
  const fetchData = async (): Promise<T> => {
    if (apiMode === 'mock') {
      // Return mock data with a simulated delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockData);
        }, 300); // Simulate network delay
      });
    } else {
      // Use real API
      if (!apiBaseUrl) {
        throw new Error("API Base URL is not configured");
      }
      
      try {
        const response = await fetch(`${apiBaseUrl}${endpoint}`);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.error("API fetch error:", error);
        throw error;
      }
    }
  };
  
  return { fetchData, apiMode };
};

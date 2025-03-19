import axios from "axios";

export const API_BASE_URL = "http://localhost:4000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Reusable error handling
export const handleApiError = (error: any, context: string): never => {
  console.error(`Error ${context}:`, error);
  
  if (axios.isAxiosError(error) && error.response) {
    console.error("Error response data:", error.response.data);
    console.error("Error response status:", error.response.status);
    
    if (error.response.data && typeof error.response.data === 'object') {
      throw {
        message: error.response.data.message || `Server error (${context})`,
        statusCode: error.response.status,
        details: error.response.data
      };
    }
    
    throw new Error(`Server error (${error.response.status}): ${error.message}`);
  }
  
  throw new Error(`Failed to ${context}. Please check your connection and try again.`);
};

// Common response interface
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}
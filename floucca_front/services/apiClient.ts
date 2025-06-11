import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_URL is not defined. Please check your .env file and build process.'
  );
}

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
    const { data, status } = error.response;

    console.error("Error response data:", data);
    console.error("Error response status:", status);

    const message = Array.isArray(data?.message)
      ? data.message.join('\n') // show validation messages line-by-line
      : data?.message || `Server error (${context})`;

    throw {
      message,
      statusCode: status,
      details: data,
    };
  }

  throw new Error(`Failed to ${context}. Please check your connection and try again.`);
};


// Common response interface
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}
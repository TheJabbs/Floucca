// services/landingService.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

export interface LandingFormDTO {
  form: {
    port_id: number;
    user_id: number;
    fisher_name: string;
    period_date?: Date;
    boat_detail?: number;
  };
  boat_details: {
    fleet_owner: string;
    fleet_registration: number;
    fleet_size: number;
    fleet_crew: number;
    fleet_max_weight: number;
    fleet_length: number;
  };
  landing?: {
    latitude: number;
    longitude: number;
  };
  fish?: Array<{
    specie_code: number;
    gear_code: number;
    fish_weight: number;
    fish_length: number;
    fish_quantity: number;
    price: number; 
  }>;
  effort?: {
    hours_fished: number;
  };
  gearDetail?: Array<{
    gear_code: number;
    detail_name: string;
    detail_value: string;
  }>;
  lastw?: Array<{
    gear_code: number;
    days_fished: number;
  }>;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}

/**
 * Submits a landing form
 */
export const submitLandingForm = async (formData: LandingFormDTO): Promise<ApiResponse> => {
  try {
    // Set headers for proper content type
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    // Convert any Date objects to ISO strings for consistent API serialization
    const processedData = JSON.parse(JSON.stringify(formData));
    
    console.log("Sending data to API:", JSON.stringify(processedData, null, 2));
    
    const response = await axios.post<ApiResponse>(
      `${API_BASE_URL}/api/dev/landings/create/form`, 
      processedData,
      config
    );
    
    return response.data;
  } catch (error) {
    console.error("API Error details:", error);
    
    // Return structured error message if available
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        // Throw with specific error message if available
        if (error.response.data && typeof error.response.data === 'object') {
          throw {
            message: error.response.data.message || "Server error",
            statusCode: error.response.status,
            details: error.response.data
          };
        }
        
        // Throw error with status code
        throw new Error(`Server error (${error.response.status}): ${error.message}`);
      }
    }
    
    // Otherwise throw generic error
    throw new Error("Failed to submit landing form. Please check your connection and try again.");
  }
};

/**
 * Fetches all ports from the API
 */
export const getPorts = async (): Promise<{port_id: number, port_name: string}[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ports`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ports:", error);
    throw error;
  }
};

/**
 * Fetches all species from the API
 */
export const getSpecies = async (): Promise<{specie_code: number, specie_name: string}[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/species/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching species:", error);
    throw error;
  }
};

/**
 * Fetches all gears from the API
 */
export const getGears = async (): Promise<{gear_code: number, gear_name: string}[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gear/all/gear`);
    return response.data;
  } catch (error) {
    console.error("Error fetching gears:", error);
    throw error;
  }
};
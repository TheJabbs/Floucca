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
    const response = await axios.post<ApiResponse>(
      `${API_BASE_URL}/api/dev/landings/create/form`, 
      formData
    );
    return response.data;
  } catch (error) {
    // return the structured error message
    if ((error as any).response && (error as any).response.data) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
    }
    // otherwise throw generic error
    throw new Error("Failed to submit landing form. Please try again later.");
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
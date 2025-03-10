// services/formsServices.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

// Data interfaces
export interface Gear {
  gear_code: number;
  gear_name: string;
  equipment_id: string;
  equipment_name: string;
}

export interface Species {
  specie_code: number;
  specie_name: string;
}

export interface Port {
  port_id: number;
  port_name: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}

// DTO for Landing Form
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

// DTO for Fleet Senses Form
export interface FleetSensesFormDTO {
  formDto: {
    port_id: number;
    user_id: number;
    fisher_name: string;
    period_date?: Date;
  };
  boatDetailDto: {
    fleet_owner: string;
    fleet_registration: number;
    fleet_size: number;
    fleet_crew: number;
    fleet_max_weight: number;
    fleet_length: number;
  };
  gearUsageDto: Array<{
    gear_code: number;
    months: number[];
  }>;
}

// API call for landing form submission
export const submitLandingForm = async (formData: LandingFormDTO): Promise<ApiResponse> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    // Process data for API serialization
    const processedData = JSON.parse(JSON.stringify(formData));
    
    console.log("Sending landing data to API:", JSON.stringify(processedData, null, 2));
    
    const response = await axios.post<ApiResponse>(
      `${API_BASE_URL}/api/dev/landings/create/form`, 
      processedData,
      config
    );
    
    return response.data;
  } catch (error) {
    console.error("API Error details:", error);
    
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      
      if (error.response.data && typeof error.response.data === 'object') {
        throw {
          message: error.response.data.message || "Server error",
          statusCode: error.response.status,
          details: error.response.data
        };
      }
      
      throw new Error(`Server error (${error.response.status}): ${error.message}`);
    }
    
    throw new Error("Failed to submit landing form. Please check your connection and try again.");
  }
};

// API call for fleet senses form submission
export const submitFleetSensesForm = async (formData: FleetSensesFormDTO): Promise<ApiResponse> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    // Process data for API serialization
    const processedData = JSON.parse(JSON.stringify(formData));
    
    console.log("Sending fleet senses data to API:", JSON.stringify(processedData, null, 2));
    
    const response = await axios.post<ApiResponse>(
      `${API_BASE_URL}/api/dev/fleet_senses/form/create`, 
      processedData,
      config
    );
    
    return response.data;
  } catch (error) {
    console.error("API Error details:", error);
    
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      
      if (error.response.data && typeof error.response.data === 'object') {
        throw {
          message: error.response.data.message || "Server error",
          statusCode: error.response.status,
          details: error.response.data
        };
      }
      
      throw new Error(`Server error (${error.response.status}): ${error.message}`);
    }
    
    throw new Error("Failed to submit fleet senses form. Please check your connection and try again.");
  }
};

// Fetch ports
export const getPorts = async (): Promise<Port[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ports`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ports:", error);
    throw error;
  }
};

// Fetch species
export const getSpecies = async (): Promise<Species[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/species/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching species:", error);
    throw error;
  }
};

// Fetch gears
export const getGears = async (): Promise<Gear[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/dev/gear/all/gear`);
    return response.data;
  } catch (error) {
    console.error("Error fetching gears:", error);
    throw error;
  }
};
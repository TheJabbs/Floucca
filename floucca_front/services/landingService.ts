import { apiClient, handleApiError, ApiResponse } from "./apiClient";

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
    fleet_hp: number;
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

// Submit landing form
export const submitLandingForm = async (formData: LandingFormDTO): Promise<ApiResponse> => {
  try {
    const processedData = JSON.parse(JSON.stringify(formData));
    
    console.log("Sending landing data to API:", JSON.stringify(processedData, null, 2));
    
    const response = await apiClient.post<ApiResponse>(
      "/api/dev/landings/create/form", 
      processedData
    );
    
    return response.data;
  } catch (error) {
    return handleApiError(error, "submitting landing form");
  }
};

// Get landing by ID
export const getLandingById = async (landingId: number): Promise<any> => {
  try {
    const response = await apiClient.get(`/api/dev/landings/landings/${landingId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `fetching landing ${landingId}`);
  }
};

// Get all landings
export const getAllLandings = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get("/api/dev/landings/all/landings");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching all landings");
  }
};
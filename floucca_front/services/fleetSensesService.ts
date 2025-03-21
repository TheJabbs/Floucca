import { apiClient, handleApiError, ApiResponse } from "./apiClient";

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
    fleet_hp: number;
    fleet_crew: number;
    fleet_max_weight: number;
    fleet_length: number;
  };
  gearUsageDto: Array<{
    gear_code: number;
    months: number[];
  }>;
}

// Submit fleet senses form
export const submitFleetSensesForm = async (formData: FleetSensesFormDTO): Promise<ApiResponse> => {
  try {
    const processedData = JSON.parse(JSON.stringify(formData));
    
    console.log("Sending fleet senses data to API:", JSON.stringify(processedData, null, 2));
    
    const response = await apiClient.post<ApiResponse>(
      "/api/dev/fleet_senses/form/create", 
      processedData
    );
    
    return response.data;
  } catch (error) {
    return handleApiError(error, "submitting fleet senses form");
  }
};

// Get all fleet senses
export const getAllFleetSenses = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get("/api/dev/fleet_senses/all/fleet");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching all fleet senses");
  }
};

// Get fleet senses by ID
export const getFleetSensesById = async (fleetSensesId: number): Promise<any> => {
  try {
    const response = await apiClient.get(`/api/dev/fleet_senses/${fleetSensesId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `fetching fleet senses ${fleetSensesId}`);
  }
};
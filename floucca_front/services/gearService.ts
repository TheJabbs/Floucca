import { apiClient, handleApiError } from "./apiClient";

export interface Gear {
  gear_code: number;
  gear_name: string;
  equipment_id: string;
  equipment_name: string;
}

// Fetch all gears
export const getGears = async (): Promise<Gear[]> => {
  try {
    const response = await apiClient.get("/api/dev/gear/all/gear");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching gears");
  }
};

// Get gear by code
export const getGearByCode = async (gearCode: number): Promise<Gear> => {
  try {
    const response = await apiClient.get(`/api/dev/gear/gear/${gearCode}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `fetching gear ${gearCode}`);
  }
};
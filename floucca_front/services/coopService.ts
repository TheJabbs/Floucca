import { apiClient, handleApiError } from "./apiClient";

export interface Coop {
  coop_code: number;
  coop_name: string;
  region_code: number;
}

// Fetch all coops
export const getCoops = async (): Promise<Coop[]> => {
  try {
    const response = await apiClient.get("/api/coop/all");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching coops");
  }
};

// Get coop by code
export const getCoopByCode = async (coopCode: number): Promise<Coop> => {
  try {
    const response = await apiClient.get(`/api/coop/${coopCode}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `fetching coop ${coopCode}`);
  }
};

// Get coops by region
export const getCoopsByRegion = async (regionCode: number): Promise<Coop[]> => {
  try {
    const allCoops = await getCoops();
    return allCoops.filter(coop => coop.region_code === regionCode);
  } catch (error) {
    return handleApiError(error, `fetching coops for region ${regionCode}`);
  }
};
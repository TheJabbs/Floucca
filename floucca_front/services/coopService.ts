import { apiClient, handleApiError, ApiResponse } from "./apiClient";

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

// Create a new coop
export const createCoop = async (coopData: Coop): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post("/api/coop/create", coopData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "creating coop");
  }
};

// Update an existing coop
export const updateCoop = async (coopCode: number, coopData: Coop): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put(`/api/coop/update/${coopCode}`, coopData);
    return response.data;
  } catch (error) {
    return handleApiError(error, `updating coop ${coopCode}`);
  }
};

// Delete a coop
export const deleteCoop = async (coopCode: number): Promise<ApiResponse> => {
  try {
    const response = await apiClient.delete(`/api/coop/delete/${coopCode}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `deleting coop ${coopCode}`);
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
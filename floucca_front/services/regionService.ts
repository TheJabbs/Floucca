import { apiClient, handleApiError } from "./apiClient";

export interface Region {
  region_code: number;
  region_name: string;
}

// Fetch all regions
export const getRegions = async (): Promise<Region[]> => {
  try {
    const response = await apiClient.get("/region/all");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching regions");
  }
};

// Get region by code
export const getRegionByCode = async (regionCode: number): Promise<Region> => {
  try {
    const response = await apiClient.get(`/region/${regionCode}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `fetching region ${regionCode}`);
  }
};
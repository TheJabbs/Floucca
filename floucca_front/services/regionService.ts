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

// Create a new region
export const createRegion = async (region: Region): Promise<Region> => {
  try {
    const response = await apiClient.post("/region/create", region);
    return response.data;
  } catch (error) {
    return handleApiError(error, "creating region");
  }
};

// Update an existing region
export const updateRegion = async (regionCode: number, region: Region): Promise<Region> => {
  try {
    const response = await apiClient.put(`/region/update/${regionCode}`, region);
    return response.data;
  } catch (error) {
    return handleApiError(error, `updating region ${regionCode}`);
  }
};

// Delete a region
export const deleteRegion = async (regionCode: number): Promise<Region> => {
  try {
    const response = await apiClient.delete(`/region/delete/${regionCode}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `deleting region ${regionCode}`);
  }
};
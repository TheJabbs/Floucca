import { apiClient, handleApiError } from "./apiClient";

export interface Species {
  specie_code: number;
  specie_name: string;
  specie_description?: string;
  specie_avg_weight: number;
  specie_avg_length: number;
}

// Fetch all species
export const getSpecies = async (): Promise<Species[]> => {
  try {
    const response = await apiClient.get("/species/all");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching species");
  }
};

// Get species by code
export const getSpeciesByCode = async (specieCode: number): Promise<Species> => {
  try {
    const response = await apiClient.get(`/species/${specieCode}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `fetching species ${specieCode}`);
  }
};
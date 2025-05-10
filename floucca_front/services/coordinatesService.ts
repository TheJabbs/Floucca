import { apiClient, handleApiError } from "./apiClient";

export interface LandingCoordinate {
  longitude: number;
  latitude: number;
}

export interface SpeciesCoordinates {
  landing: LandingCoordinate[];
  specie_code: number;
}

export interface CoordinatesFilter {
  period?: string;
  specie_code: number[];
}

/**
 * Fetches landing coordinates for specified species
 */
export const getSpeciesCoordinates = async (
  filter: CoordinatesFilter
): Promise<SpeciesCoordinates[]> => {
  try {
    const response = await apiClient.post<SpeciesCoordinates[]>(
      "/api/dev/landings/coordinates",
      filter
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching species coordinates");
  }
};
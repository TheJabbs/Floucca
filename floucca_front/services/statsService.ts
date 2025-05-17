import { apiClient, handleApiError } from "./apiClient";

export interface EffortData {
  records: number;
  gears: number;
  activeDays: number;
  pba: number;
  estEffort: number;
}

export interface LandingsData {
  records: number;
  avgPrice: number;
  estValue: number;
  cpue: number;
  estCatch: number;
  sampleCatch: number;
}

export interface SpeciesData {
  specie_name: string;
  numbOfCatch: number;
  avgPrice: number;
  avgWeight: number;
  avgLength: number;
  avgQuantity: number;
  value: number;
  cpue: number;
  estCatch: number;
  effort: number;
}

export interface EffortAndLandingData {
  upperTables: {
    effort: EffortData;
    landings: LandingsData;
  };
  lowerTable: SpeciesData[];
}

export interface StatsFilter {
  period: string;
  gear_code?: number[];
  port_id?: number[];
  region?: number[];
  coop?: number[];
  specie_code?: number[];
}

/**
 * Fetch statistics data from the API
 */
export const fetchStatisticsData = async (filter: StatsFilter): Promise<EffortAndLandingData> => {
  try {
    console.log("Sending filter to API:", filter);
    
    const response = await apiClient.post('/api/dev/formulas/report/effort&landing', filter);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'fetching statistics data');
  }
};

import { apiClient, handleApiError } from "./apiClient";

export interface EffortAndLandingData {
  uperTable: {
    effort: {
      records: number;
      gears: number;
      activeDays: number;
      pba: number;
      estEffort: number;
    };
    landings: {
      records: number;
      avgPrice: number;
      estValue: number;
      cpue: number;
      estCatch: number;
      sampleEffort: number;
    };
  };
  lowerTable: Array<{
    specie_code: number;
    avg_fish_weight: number;
    avg_fish_quantity: number;
    avg_fish_length: number;
    avg_price: number;
    fish_value: number;
    cpue: number;
    est_catch: number;
  }>;
}

export interface StatsFilter {
  period: string;
  gear_code?: number[];
  port_id?: number[];
  region?: number[];
  coop?: number[];
}

export const fetchStatisticsData = async (filter: StatsFilter): Promise<EffortAndLandingData> => {
  try {
    // Format the filter for the API
    const apiFilter = {
      period: filter.period,
      gear_code: filter.gear_code ? filter.gear_code : undefined,
      port_id: filter.port_id ? filter.port_id : undefined,
      region: filter.region ? filter.region : undefined,
      coop: filter.coop ? filter.coop : undefined
    };

    console.log("Sending filter to API:", apiFilter);
    
    const response = await apiClient.post('/api/dev/formulas/report/effort&landing', apiFilter);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'fetching statistics data');
  }
};

export const mapSpeciesData = (speciesData: Array<{
  specie_code: number;
  avg_fish_weight: number;
  avg_fish_quantity: number;
  avg_fish_length: number;
  avg_price: number;
  fish_value: number;
  cpue: number;
  est_catch: number;
}>, speciesMap: Record<number, string> = {}): any[] => {
  return speciesData.map(species => ({
    species: speciesMap[species.specie_code] || `Species ${species.specie_code}`,
    averageWeight: species.avg_fish_weight,
    fishCount: species.avg_fish_quantity,
    price: species.avg_price,
    value: species.fish_value,
    cpue: species.cpue,
    estCatch: species.est_catch
  }));
};

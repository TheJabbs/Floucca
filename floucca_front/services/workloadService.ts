import { apiClient, handleApiError } from "./apiClient";

export interface WorkloadFilterValues {
  period?: string;
  port_id?: number[]; // Still array in the type but we'll only use single values
  coop?: number[];    // Still array in the type but we'll only use single values
  region?: number[];  // Still array in the type but we'll only use single values
}

export interface WorkLoadStatisticItem {
  dataOperator: string;
  landingSamples: number;
  effortSample: number;
  allSamples: number;
  totalEffortPerc: number;
  totalPerc: number;
  allSamplesPerc: number;
}

export interface WorkloadStatsResponse {
  work: WorkLoadStatisticItem[];
  totals: {
    allEffortSample: number;
    allLaningSample: number;
    allSamples: number;
  };
}

/**
 * Fetches workload statistics based on provided filters
 * @param filters Optional filters including period, port_id, coop, and region
 * @returns Workload statistics data
 */
export const fetchWorkloadStats = async (filters: WorkloadFilterValues = {}): Promise<WorkloadStatsResponse> => {
  try {
    // Clean up the filters object by removing undefined/null values
    const cleanFilters = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : true))
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value
      }), {});

    console.log("Sending workload filters to API:", cleanFilters);
    
    const response = await apiClient.post<WorkloadStatsResponse>("/users/workload", cleanFilters);
    
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching workload statistics");
  }
};

/**
 * Formats a workload statistic value as a percentage with 1 decimal place
 * @param value The decimal value to format
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  return `${(value).toFixed(1)}%`;
};
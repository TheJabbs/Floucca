import { apiClient, handleApiError } from "./apiClient";

export interface FishStatInterface {
  specie_name: string;
  avg_length: number;
  avg_weight: number;
  avg_price: number;
  avg_quantity: number;
}

export interface FishStatsResponse {
  [period: string]: {
    [specieCode: number]: FishStatInterface;
  };
}

/**
 * Fetch fish statistics with the given filters
 */
export const getFishStatistics = async (): Promise<FishStatsResponse> => {
  try {
    const response = await apiClient.post("/api/fish/stats/avg");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching fish statistics");
  }
};

/**
 * Extract unique month names from period dates
 */
export const extractUniqueMonths = (data: FishStatsResponse): string[] => {
  const months = new Set<string>();
  
  Object.keys(data).forEach(period => {
    try {
      // Convert period string to Date object
      const date = new Date(period);
      // Get the month name
      const monthName = date.toLocaleString('default', { month: 'long' });
      months.add(monthName);
    } catch (e) {
      console.error(`Error parsing period date: ${period}`, e);
    }
  });
  
  return Array.from(months).sort((a, b) => {
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthOrder.indexOf(a) - monthOrder.indexOf(b);
  });
};

/**
 * Extract unique species from the data
 */
export const extractUniqueSpecies = (data: FishStatsResponse): { code: number, name: string }[] => {
  const speciesMap = new Map<number, string>();
  
  Object.values(data).forEach(periodData => {
    Object.entries(periodData).forEach(([specieCode, specieData]) => {
      speciesMap.set(Number(specieCode), specieData.specie_name);
    });
  });
  
  return Array.from(speciesMap.entries()).map(([code, name]) => ({ code, name }));
};

/**
 * Filter data by month
 */
export const filterDataByMonth = (
  data: FishStatsResponse, 
  month: string
): FishStatsResponse => {
  const filteredData: FishStatsResponse = {};
  
  Object.entries(data).forEach(([period, periodData]) => {
    try {
      const date = new Date(period);
      const monthName = date.toLocaleString('default', { month: 'long' });
      
      if (monthName === month) {
        filteredData[period] = periodData;
      }
    } catch (e) {
      console.error(`Error parsing period date: ${period}`, e);
    }
  });
  
  return filteredData;
};

/**
 * Transform data for the chart
 */
export const transformDataForChart = (
  data: FishStatsResponse,
  metric: 'avg_weight' | 'avg_quantity' | 'avg_price',
  selectedSpecies: number[]
): any[] => {
  const chartData: any[] = [];
  
  // Sort periods chronologically
  const sortedPeriods = Object.keys(data).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );
  
  sortedPeriods.forEach(period => {
    const periodData = data[period];
    const entry: any = { period: formatPeriodDate(period) };
    
    Object.entries(periodData).forEach(([specieCode, specieData]) => {
      const code = Number(specieCode);
      if (selectedSpecies.includes(code)) {
        entry[`${specieData.specie_name} (${code})`] = specieData[metric];
      }
    });
    
    chartData.push(entry);
  });
  
  return chartData;
};

/**
 * Format period date for display
 */
export const formatPeriodDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  } catch (e) {
    console.error(`Error formatting date: ${dateStr}`, e);
    return dateStr;
  }
};
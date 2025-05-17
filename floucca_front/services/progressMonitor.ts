import { apiClient, handleApiError } from "./apiClient";

export interface WorkProgressData {
  gearName: string;
  gearUnit: number;
  landing: {
    samplingDays: number;
    samplingDaysMin: number;
    samples: number;
    samplesMin: number;
  };
  effort: {
    samples: number;
    samplesMin: number;
  };
}

export interface WorkProgressFilter {
  period: string;
  port_id: number[];
}

export const fetchWorkProgressData = async (filter: WorkProgressFilter): Promise<WorkProgressData[]> => {
  try {
    console.log("Fetching work progress data with filter:", filter);
    
    const response = await apiClient.post('/api/dev/formulas/report/workloadstat', filter);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'fetching work progress data');
  }
};
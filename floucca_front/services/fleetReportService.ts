import { apiClient, handleApiError } from "./apiClient";

export interface FleetReportFilter {
  period: string;
  port_id?: number[];
  coop?: number[];
  region?: number[];
}

export interface FleetReportData {
  gear_code: number;
  gear_name: string;
  month: number;
  freq: number;
  activeDays: number;
}

export const fetchFleetReport = async (filter: FleetReportFilter): Promise<FleetReportData[]> => {
  try {
    console.log("Sending fleet report filter to API:", filter);
    const response = await apiClient.post('/api/dev/fleet_senses/report', filter);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'fetching fleet report');
  }
};
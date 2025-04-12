import { apiClient } from "./apiClient";

export interface StatsData {
  strata: {
    port: number;
    coop: number;
    region: number;
  };
  speciesKind: number;
  effortRecord: number;
  landingRecord: number;
  totalGears: number;
  sampleCatch: number;
}

export interface ApiResponse {
  [date: string]: StatsData;
}

export const fetchLeftPanelStats = async (): Promise<ApiResponse> => {
  const response = await apiClient.get("/api/dev/formulas/report/leftPanel");
  const data = response.data;
  return data;
};

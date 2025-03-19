import { apiClient, handleApiError } from "./apiClient";

export interface Period {
  period_date: string;
  period_status: string;
}

// Fetch all periods
export const getPeriods = async (): Promise<Period[]> => {
  try {
    const response = await apiClient.get("/api/dev/period/all/period");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching periods");
  }
};

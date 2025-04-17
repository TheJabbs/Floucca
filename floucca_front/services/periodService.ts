import { apiClient, handleApiError } from "./apiClient";

export interface Period {
  period_date: string; 
  period_status: "A" | "B" | "F"; 
}

export interface ActiveDaysEntry {
  port_id: number;
  period_date: string;
  gear_code: string;
  active_days: number;
}

export const getPeriods = async (): Promise<Period[]> => {
  try {
    const response = await apiClient.get("/api/dev/period/all/period");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching periods");
  }
};

export const getPeriodActiveDays = async (
  filters?: { port_id?: number; gear_code?: string }
): Promise<ActiveDaysEntry[]> => {
  try {
    const params = new URLSearchParams();

    if (filters?.port_id) params.append("port_id", filters.port_id.toString());
    if (filters?.gear_code) params.append("gear_code", filters.gear_code);

    const response = await apiClient.get(
      `/api/dev/period/all/period/active_days?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching period active days");
  }
};
export const updatePeriodStatus = async ({
  period_date,
  period_status,
}: {
  period_date: string;
  period_status: 'A' | 'B' | 'F';
}) => {
  try {
    const response = await apiClient.put(`/api/dev/period/update`, {
      period_date,
      period_status,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'updating period');
  }
};

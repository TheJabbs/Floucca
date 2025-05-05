// services/bulkEntriesService.ts

import { apiClient, handleApiError } from "./apiClient";

export interface GearReport {
  gear_code: number;
  gear_name: string;
  month: number;
  freq: number;
  activeDays: number;
}

export interface BulkEntryPayload {
  formDto: {
    user_id: number;
    port_id: number;
    fisher_name: string;
    period_date: string;
  };
  gearUsageDto: {
    gear_code: number;
    months: number[];
  };
  numberOfGears: number;
}

export interface BulkEntryResponse {
  message: string;
  entriesCreated?: number;
  expectedEntries?: number;
}

export const fetchGearReport = async (
  year: string,
  month: string,
  portId: number
): Promise<GearReport[]> => {
  try {
    const response = await apiClient.post(
      `/api/dev/fleet_senses/report/${month}`,
      {
        period: year,
        port_id: [portId],
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching gear report");
  }
};

export const submitBulkEntries = async (
  payload: BulkEntryPayload
): Promise<BulkEntryResponse> => {
  try {
    const response = await apiClient.post(
      "/api/dev/fleet_senses/bulk",
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "submitting bulk entries");
  }
};
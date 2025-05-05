import { apiClient, handleApiError } from "./apiClient";

export interface Period {
  period_date: string;
  period_status: string;
}

export interface ActiveDay {
  active_id: number;
  period_date: string;
  port_id: number;
  gear_code: number;
  active_days: number;
}

export interface PeriodWithActiveDays {
  period: Period;
  activeDays: ActiveDay[];
}

//  fetch all periods with their active days
export const getAllPeriodsWithActiveDays = async (): Promise<PeriodWithActiveDays[]> => {
  try {
    const response = await apiClient.get("/api/dev/period/all/period/active_days");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching periods with active days");
  }
};

// update period status
export const updatePeriodStatus = async (periodDate: string, newStatus: string): Promise<any> => {
  try {
    const response = await apiClient.put("/api/dev/period/update", {
      period_date: periodDate,
      period_status: newStatus
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "updating period status");
  }
};

// active days for a specific entry
export const updateActiveDay = async (activeId: number, activeDays: number): Promise<any> => {
  try {
    const response = await apiClient.put("/api/dev/active_days/update/${activeId}", {
      active_days: activeDays
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "updating active days");
  }
};

//function to get max days in a month based on a date string
export const getDaysInMonthByDate = (date: string): number => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  return new Date(year, month, 0).getDate();
};

//format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long"
  });
};

export const getPeriods = async (): Promise<Period[]> => {
  try {
    const response = await apiClient.get("/api/dev/period/all/period");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching periods");
  }
};
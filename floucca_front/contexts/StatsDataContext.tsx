"use client";

import React, { createContext, ReactNode, useContext } from "react";
import { 
  getGears, 
  getPorts, 
  getRegions, 
  getCoops, 
  getPeriods 
} from "@/services";
import { useDataContext, formatPeriodDate } from "@/hooks/useDataContext";

export interface StatsDataType {
  gears: any[];
  ports: any[];
  regions: any[];
  coops: any[];
  periods: any[];
  formattedPeriods: { value: string, label: string }[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  refetch: () => Promise<void>;
}

const CACHE_KEYS = {
  STATS_GEARS: "flouca_stats_gears",
  STATS_PORTS: "flouca_stats_ports",
  STATS_REGIONS: "flouca_stats_regions",
  STATS_COOPS: "flouca_stats_coops",
  STATS_PERIODS: "flouca_stats_periods",
};

const StatsDataContext = createContext<StatsDataType | undefined>(undefined);

export function useStatsData() {
  const context = useContext(StatsDataContext);
  if (!context) {
    throw new Error("useStatsData must be used within a StatsDataProvider");
  }
  return context;
}

// Provider component
export function StatsDataProvider({ children }: { children: ReactNode }) {
  // Use our custom hook for each data type
  const gearContext = useDataContext(getGears, CACHE_KEYS.STATS_GEARS);
  const portContext = useDataContext(getPorts, CACHE_KEYS.STATS_PORTS);
  const regionContext = useDataContext(getRegions, CACHE_KEYS.STATS_REGIONS);
  const coopContext = useDataContext(getCoops, CACHE_KEYS.STATS_COOPS);
  const periodContext = useDataContext(getPeriods, CACHE_KEYS.STATS_PERIODS);

  const formattedPeriods = periodContext.data.map(period => ({
    value: period.period_date,
    label: `${formatPeriodDate(period.period_date).split(' ')[0]} ${period.period_status}`
  }));

  const refetchAll = async () => {
    await Promise.all([
      gearContext.refetch(),
      portContext.refetch(),
      regionContext.refetch(),
      coopContext.refetch(),
      periodContext.refetch()
    ]);
  };

  const isLoading = 
    gearContext.isLoading || 
    portContext.isLoading || 
    regionContext.isLoading ||
    coopContext.isLoading ||
    periodContext.isLoading;
  
  const error = 
    gearContext.error || 
    portContext.error || 
    regionContext.error ||
    coopContext.error ||
    periodContext.error;

  const lastFetchedTimes = [
    gearContext.lastFetched,
    portContext.lastFetched,
    regionContext.lastFetched,
    coopContext.lastFetched,
    periodContext.lastFetched
  ].filter(Boolean) as number[];
  
  const lastFetched = lastFetchedTimes.length > 0 
    ? Math.max(...lastFetchedTimes) 
    : null;

  // Create the combined context value
  const value: StatsDataType = {
    gears: gearContext.data,
    ports: portContext.data,
    regions: regionContext.data,
    coops: coopContext.data,
    periods: periodContext.data,
    formattedPeriods,
    isLoading,
    error,
    lastFetched,
    refetch: refetchAll
  };

  return (
    <StatsDataContext.Provider value={value}>
      {children}
    </StatsDataContext.Provider>
  );
}
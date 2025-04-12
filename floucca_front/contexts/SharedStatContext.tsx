"use client";

import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { fetchLeftPanelStats } from "@/services/leftPanelService";
import { getFromCache, saveToCache, isCacheValid } from "@/components/utils/cache-utils";

// Cache constants
const STATS_PANEL_CACHE_KEY = 'flouca_stats_panel';
const CACHE_EXPIRATION = 15 * 60 * 1000; // 15 minutes

// Stats data interfaces
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

// Context type
interface SharedStatsContextType {
  statsData: ApiResponse | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  refreshStats: () => Promise<void>;
  getLatestPeriodStats: () => {
    ports: number;
    coops: number;
    regions: number;
    species: number;
    effortRecords: number;
    landingRecords: number;
    totalGears: number;
    sampleCatch: number;
  } | null;
}

// Create the context
const SharedStatsContext = createContext<SharedStatsContextType | undefined>(undefined);

// Provider component
export function SharedStatsProvider({ children }: { children: ReactNode }) {
  const [statsData, setStatsData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  // Function to fetch stats data
  const fetchStats = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get from cache if not forcing refresh
      if (!forceRefresh) {
        const cachedData = getFromCache<ApiResponse>(STATS_PANEL_CACHE_KEY, CACHE_EXPIRATION);
        if (cachedData) {
          console.log('Using cached stats data');
          setStatsData(cachedData);
          
          // Get the timestamp from cache
          if (isCacheValid(STATS_PANEL_CACHE_KEY, CACHE_EXPIRATION)) {
            const timestamp = localStorage.getItem(`${STATS_PANEL_CACHE_KEY}_timestamp`);
            setLastFetched(timestamp ? parseInt(timestamp, 10) : null);
          }
          
          setIsLoading(false);
          return;
        }
      }

      // Fetch fresh data
      console.log('Fetching fresh stats data');
      const data = await fetchLeftPanelStats();
      setStatsData(data);
      
      // Save to cache
      saveToCache(STATS_PANEL_CACHE_KEY, data);
      setLastFetched(Date.now());
      
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get the latest period's stats
  const getLatestPeriodStats = () => {
    if (!statsData || Object.keys(statsData).length === 0) return null;
    
    // Get the most recent period
    const periods = Object.keys(statsData).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    if (periods.length === 0) return null;
    
    const latestPeriod = periods[0];
    const latestData = statsData[latestPeriod];
    
    if (!latestData) return null;
    
    return {
      ports: latestData.strata.port,
      coops: latestData.strata.coop,
      regions: latestData.strata.region,
      species: latestData.speciesKind,
      effortRecords: latestData.effortRecord,
      landingRecords: latestData.landingRecord,
      totalGears: latestData.totalGears,
      sampleCatch: latestData.sampleCatch
    };
  };

  // Initial data fetch
  useEffect(() => {
    fetchStats();
  }, []);

  // Context value
  const value: SharedStatsContextType = {
    statsData,
    isLoading,
    error,
    lastFetched,
    refreshStats: () => fetchStats(true),
    getLatestPeriodStats
  };

  return (
    <SharedStatsContext.Provider value={value}>
      {children}
    </SharedStatsContext.Provider>
  );
}

// Hook to use the context
export function useSharedStats() {
  const context = useContext(SharedStatsContext);
  if (context === undefined) {
    throw new Error("useSharedStats must be used within a SharedStatsProvider");
  }
  return context;
}
"use client";

import { useState, useEffect } from "react";
import { getFromCache, saveToCache } from "@/components/utils/cache-utils";

export interface DataContextState<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  refetch: () => Promise<void>;
}

export const formatPeriodDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours ? date.getHours() : ''} ${dateString.includes('T') ? dateString.split('T')[1].split('.')[0].substring(0, 5) : ''}`
    .trim();
};

export const useDataContext = <T,>(
  fetchFunction: () => Promise<T[]>,
  cacheKey: string,
  cacheExpiration: number = 60 * 60 * 1000
): DataContextState<T> => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`Fetching fresh data for ${cacheKey}...`);

      const fetchedData = await fetchFunction();
      setData(fetchedData);
      
      // Save to cache
      saveToCache(cacheKey, fetchedData);
      
      setLastFetched(Date.now());
      console.log(`Fresh data for ${cacheKey} fetched and cached successfully`);
    } catch (error) {
      console.error(`Error fetching data for ${cacheKey}:`, error);
      setError(`Failed to load ${cacheKey} data. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      // Try to get data from cache first
      const cachedData = getFromCache<T[]>(cacheKey, cacheExpiration);
      
      // If cache is valid, use it
      if (cachedData) {
        console.log(`Data for ${cacheKey} loaded from cache successfully`);
        setData(cachedData);
        
        // Find timestamp from the cache
        const timestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        setLastFetched(timestamp ? parseInt(timestamp, 10) : null);
        
        setIsLoading(false);
      } else {
        // Fetch fresh data if cache is invalid or incomplete
        await fetchData();
      }
    };

    initializeData();
  }, [cacheKey]);

  return {
    data,
    isLoading,
    error,
    lastFetched,
    refetch: fetchData
  };
};
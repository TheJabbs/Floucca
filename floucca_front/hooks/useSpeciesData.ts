import { useState, useEffect } from "react";
import { getSpecies } from "@/services/speciesService";
import { getPeriods } from "@/services/periodService";
import { getFromCache, saveToCache } from "@/components/utils/cache-utils";

const CACHE_KEYS = {
  SPECIES: "flouca_species_data",
  PERIODS: "flouca_periods_data",
};

const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hour

export function useSpecies() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Try to get from cache first
        const cachedData = getFromCache<any[]>(CACHE_KEYS.SPECIES, CACHE_EXPIRATION);
        
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          return;
        }
        
        // Fetch from API if not in cache
        const speciesData = await getSpecies();
        setData(speciesData);
        
        // Save to cache
        saveToCache(CACHE_KEYS.SPECIES, speciesData);
      } catch (err: any) {
        setError(err.message || "Failed to load species data");
        console.error("Error fetching species:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}

export function usePeriods() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Try to get from cache first
        const cachedData = getFromCache<any[]>(CACHE_KEYS.PERIODS, CACHE_EXPIRATION);
        
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          return;
        }
        
        // Fetch from API if not in cache
        const periodsData = await getPeriods();
        setData(periodsData);
        
        // Save to cache
        saveToCache(CACHE_KEYS.PERIODS, periodsData);
      } catch (err: any) {
        setError(err.message || "Failed to load periods data");
        console.error("Error fetching periods:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}
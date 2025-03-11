"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import {
  getGears,
  getSpecies,
  getPorts,
  Gear,
  Species,
  Port,
} from "@/services/formsServices";

// Define the context data structure
interface FormsDataContextType {
  gears: Gear[];
  species: Species[];
  ports: Port[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  refetch: () => Promise<void>;
}

// Default context values
const defaultContextValue: FormsDataContextType = {
  gears: [],
  species: [],
  ports: [],
  isLoading: true,
  error: null,
  lastFetched: null,
  refetch: async () => {},
};

// Cache keys for localStorage
const CACHE_KEYS = {
  GEARS: "flouca_cached_gears",
  SPECIES: "flouca_cached_species",
  PORTS: "flouca_cached_ports",
  LAST_FETCHED: "flouca_last_fetched",
};

const CACHE_EXPIRATION = 60 * 60 * 1000;

export const FormsDataContext =
  createContext<FormsDataContextType>(defaultContextValue);

export function useFormsData() {
  const context = useContext(FormsDataContext);

  if (!context) {
    throw new Error("useFormsData must be used within a FormsDataProvider");
  }

  return context;
}

interface FormsDataProviderProps {
  children: ReactNode;
}

export function FormsDataProvider({ children }: FormsDataProviderProps) {
  const [gears, setGears] = useState<Gear[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  // load data from cache
  const loadFromCache = () => {
    try {
      // last fetch timestamp
      const cachedLastFetched = localStorage.getItem(CACHE_KEYS.LAST_FETCHED);
      const lastFetchTime = cachedLastFetched
        ? parseInt(cachedLastFetched, 10)
        : null;

      // Check if cache is expired
      const isExpired = lastFetchTime
        ? Date.now() - lastFetchTime > CACHE_EXPIRATION
        : true;

      if (isExpired) {
        console.log("Cache is expired or doesn't exist");
        return false;
      }

      // Load cached data
      const cachedGears = localStorage.getItem(CACHE_KEYS.GEARS);
      const cachedSpecies = localStorage.getItem(CACHE_KEYS.SPECIES);
      const cachedPorts = localStorage.getItem(CACHE_KEYS.PORTS);

      // If any cache is missing, fetch fresh data
      if (!cachedGears || !cachedSpecies || !cachedPorts) {
        return false;
      }

      // Parse and set cached data
      setGears(JSON.parse(cachedGears));
      setSpecies(JSON.parse(cachedSpecies));
      setPorts(JSON.parse(cachedPorts));
      setLastFetched(lastFetchTime);
      setIsLoading(false);

      console.log("Data loaded from cache successfully");
      return true;
    } catch (error) {
      console.error("Error loading from cache:", error);
      return false;
    }
  };

  // Function to save data to cache
  const saveToCache = (data: {
    gears: Gear[];
    species: Species[];
    ports: Port[];
  }) => {
    try {
      const now = Date.now();
      localStorage.setItem(CACHE_KEYS.GEARS, JSON.stringify(data.gears));
      localStorage.setItem(CACHE_KEYS.SPECIES, JSON.stringify(data.species));
      localStorage.setItem(CACHE_KEYS.PORTS, JSON.stringify(data.ports));
      localStorage.setItem(CACHE_KEYS.LAST_FETCHED, now.toString());
      setLastFetched(now);
      console.log("Data saved to cache successfully");
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  };

  // Function to fetch data from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching fresh data from API...");

      const [fetchedGears, fetchedSpecies, fetchedPorts] = await Promise.all([
        getGears(),
        getSpecies(),
        getPorts(),
      ]);

      setGears(fetchedGears);
      setSpecies(fetchedSpecies);
      setPorts(fetchedPorts);

      saveToCache({
        gears: fetchedGears,
        species: fetchedSpecies,
        ports: fetchedPorts,
      });

      console.log("Fresh data fetched and cached successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load required data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      // Try to load from cache first
      const cacheLoaded = loadFromCache();

      // If cache is not available or expired, fetch fresh data
      if (!cacheLoaded) {
        await fetchData();
      }
    };

    initializeData();
  }, []);

  // Context value
  const contextValue: FormsDataContextType = {
    gears,
    species,
    ports,
    isLoading,
    error,
    lastFetched,
    refetch: fetchData,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <FormsDataContext.Provider value={contextValue}>
      {children}
    </FormsDataContext.Provider>
  );
}

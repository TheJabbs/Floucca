"use client";

import React, { createContext, ReactNode, useContext } from "react";
import { getGears, getSpecies, getPorts, getPeriods } from "@/services"; 
import { useDataContext } from "@/hooks/useDataContext";

export interface FormDataType {
  gears: any[];
  species: any[];
  ports: any[];
  periods: any[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  refetch: () => Promise<void>;
}

const CACHE_KEYS = {
  FORM_GEARS: "flouca_form_gears",
  FORM_SPECIES: "flouca_form_species",
  FORM_PORTS: "flouca_form_ports",
  FORM_PERIODS: "flouca_form_periods",
};

const FormsDataContext = createContext<FormDataType | undefined>(undefined);

export function useFormsData() {
  const context = useContext(FormsDataContext);
  if (!context) {
    throw new Error("useFormsData must be used within a FormsDataProvider");
  }
  return context;
}

// Provider component
export function FormsDataProvider({ children }: { children: ReactNode }) {
  // Use our custom hook for each data type
  const gearContext = useDataContext(getGears, CACHE_KEYS.FORM_GEARS);
  const speciesContext = useDataContext(getSpecies, CACHE_KEYS.FORM_SPECIES);
  const portContext = useDataContext(getPorts, CACHE_KEYS.FORM_PORTS);
  const periodContext = useDataContext(getPeriods, CACHE_KEYS.FORM_PERIODS);

  // Combined refetch function
  const refetchAll = async () => {
    await Promise.all([
      gearContext.refetch(),
      speciesContext.refetch(),
      portContext.refetch(),
      periodContext.refetch()
    ]);
  };

  const isLoading = gearContext.isLoading || speciesContext.isLoading || portContext.isLoading || periodContext.isLoading;
  
  // Determine overall error state (first error encountered)
  const error = gearContext.error || speciesContext.error || portContext.error || periodContext.error;

  // Find the most recent fetch time
  const lastFetchedTimes = [
    gearContext.lastFetched,
    speciesContext.lastFetched,
    portContext.lastFetched,
    periodContext.lastFetched
  ].filter(Boolean) as number[];
  
  const lastFetched = lastFetchedTimes.length > 0 
    ? Math.max(...lastFetchedTimes) 
    : null;

  // Create the combined context value
  const value: FormDataType = {
    gears: gearContext.data,
    species: speciesContext.data,
    ports: portContext.data,
    periods: periodContext.data,
    isLoading,
    error,
    lastFetched,
    refetch: refetchAll
  };

  return (
    <FormsDataContext.Provider value={value}>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        children
      )}
    </FormsDataContext.Provider>
  );
}
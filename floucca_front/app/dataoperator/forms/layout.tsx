"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { getGears, getSpecies, getPorts, Gear, Species, Port } from "@/services/formsServices";

// Define the context data structure
interface FormsDataContextType {
  gears: Gear[];
  species: Species[];
  ports: Port[];
}

// Create a properly typed context
export const FormsDataContext = React.createContext<FormsDataContextType | null>(null);

// Add proper typing for children prop
interface FormsLayoutProps {
  children: ReactNode;
}

export default function FormsLayout({ children }: FormsLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharedData, setSharedData] = useState<FormsDataContextType>({
    gears: [],
    species: [],
    ports: []
  });

useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [gears, species, ports] = await Promise.all([
        getGears(),
        getSpecies(),
        getPorts()
      ]);
      setSharedData({ gears, species, ports });
    } catch (error) {
      console.error("Error fetching forms data:", error);
      setError("Failed to load required data");
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p>Loading form data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <FormsDataContext.Provider value={sharedData}>
      {children}
    </FormsDataContext.Provider>
  );
}
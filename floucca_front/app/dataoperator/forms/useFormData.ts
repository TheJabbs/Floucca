"use client";

import { useContext } from "react";
import { FormsDataContext } from "./layout";
import { Gear, Species, Port } from "@/services/formsServices";

// Define return type for the hook
interface FormsDataContextType {
  gears: Gear[];
  species: Species[];
  ports: Port[];
}

export function useFormsData(): FormsDataContextType {
  const context = useContext(FormsDataContext);
  
  if (!context) {
    throw new Error("useFormsData must be used within a FormsDataContext.Provider");
  }
  
  return context;
}
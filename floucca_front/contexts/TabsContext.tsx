"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

//define the types for the shared report state
export interface ReportState {
  id: string;
  filterParams: {
    period: string;
    gearCodes: number[];
    filterType: "port" | "region" | "coop";
    portIds?: number[];
    regionIds?: number[];
    coopIds?: number[];
  };
  data: any; //the actual report data
  timestamp: string;
}

// define the context interface
interface SharedStatsContextType {
  reports: ReportState[];
  activeReportIndex: number;
  compareReportIndex: number | null;
  isComparing: boolean;
  addReport: (reportData: any, filterParams: any) => void;
  updateReport: (index: number, reportData: any, filterParams: any) => void;
  removeReport: (index: number) => void;
  setActiveReport: (index: number) => void;
  toggleCompare: (index: number | null) => void;
}

// create context with default values
const SharedStatsContext = createContext<SharedStatsContextType | undefined>(undefined);

// provider component
export function SharedStatsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<ReportState[]>([]);
  const [activeReportIndex, setActiveReportIndex] = useState<number>(0);
  const [compareReportIndex, setCompareReportIndex] = useState<number | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // add a new report
  const addReport = (reportData: any, filterParams: any) => {
    const newReport: ReportState = {
      id: `report-${Date.now()}`,
      filterParams,
      data: reportData,
      timestamp: new Date().toISOString(),
    };
    
    setReports([...reports, newReport]);
    setActiveReportIndex(reports.length);
  };

  // update an existing report
  const updateReport = (index: number, reportData: any, filterParams: any) => {
    if (index < 0 || index >= reports.length) return;
    
    const updatedReports = [...reports];
    updatedReports[index] = {
      ...updatedReports[index],
      filterParams,
      data: reportData,
      timestamp: new Date().toISOString(),
    };
    
    setReports(updatedReports);
  };

  // remove a report
  const removeReport = (index: number) => {
    if (index < 0 || index >= reports.length) return;
    
    const newReports = reports.filter((_, i) => i !== index);
    
    // update active report index if necessary
    if (index === activeReportIndex) {
      setActiveReportIndex(Math.max(0, index - 1));
    } else if (index < activeReportIndex) {
      setActiveReportIndex(activeReportIndex - 1);
    }
    
    // update compare index if necessary
    if (index === compareReportIndex) {
      setCompareReportIndex(null);
      setIsComparing(false);
    } else if (compareReportIndex !== null && index < compareReportIndex) {
      setCompareReportIndex(compareReportIndex - 1);
    }
    
    setReports(newReports);
  };

  // set the active report
  const setActiveReport = (index: number) => {
    if (index >= 0 && index < reports.length) {
      setActiveReportIndex(index);
    }
  };

  // toggle comparison mode
  const toggleCompare = (index: number | null) => {
    if (index === null) {
      setIsComparing(false);
      setCompareReportIndex(null);
      return;
    }
    
    if (index === activeReportIndex) return; // cant compare with self
    
    if (index === compareReportIndex) {
      // Toggle off
      setIsComparing(false);
      setCompareReportIndex(null);
    } else {
      // Set new comparison
      setIsComparing(true);
      setCompareReportIndex(index);
    }
  };

  return (
    <SharedStatsContext.Provider
      value={{
        reports,
        activeReportIndex,
        compareReportIndex,
        isComparing,
        addReport,
        updateReport,
        removeReport,
        setActiveReport,
        toggleCompare,
      }}
    >
      {children}
    </SharedStatsContext.Provider>
  );
}

// Custom hook to use the context
export function useSharedStats() {
  const context = useContext(SharedStatsContext);
  if (context === undefined) {
    throw new Error("useSharedStats must be used within a SharedStatsProvider");
  }
  return context;
}
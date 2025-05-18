"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PeriodContextType {
  selectedPeriod: string | null;
  setSelectedPeriod: (period: string | null) => void;
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  return (
    <PeriodContext.Provider value={{ selectedPeriod, setSelectedPeriod }}>
      {children}
    </PeriodContext.Provider>
  );
}

export function usePeriod() {
  const context = useContext(PeriodContext);
  if (context === undefined) {
    throw new Error('usePeriod must be used within a PeriodProvider');
  }
  return context;
}
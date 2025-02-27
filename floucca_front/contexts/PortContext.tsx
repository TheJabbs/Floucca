"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PortContextType {
  selectedPort: number | null;
  setSelectedPort: (port: number | null) => void;
}

const PortContext = createContext<PortContextType | undefined>(undefined);

export function PortProvider({ children }: { children: ReactNode }) {
  const [selectedPort, setSelectedPort] = useState<number | null>(null);

  return (
    <PortContext.Provider value={{ selectedPort, setSelectedPort }}>
      {children}
    </PortContext.Provider>
  );
}

export function usePort() {
  const context = useContext(PortContext);
  if (context === undefined) {
    throw new Error('usePort must be used within a PortProvider');
  }
  return context;
}
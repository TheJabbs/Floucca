"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PortContextType {
  selectedPort: string;
  setSelectedPort: (port: string) => void;
}

const PortContext = createContext<PortContextType | undefined>(undefined);

export function PortProvider({ children }: { children: ReactNode }) {
  const [selectedPort, setSelectedPort] = useState<string>('');

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
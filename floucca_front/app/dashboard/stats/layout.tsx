"use client";

import React, { ReactNode } from "react";
import { StatsDataProvider } from "@/contexts/StatsDataContext";

interface StatsLayoutProps {
  children: ReactNode;
}

export default function StatsLayout({ children }: StatsLayoutProps) {
  return (
    <StatsDataProvider>
      {children}
    </StatsDataProvider>
  );
}
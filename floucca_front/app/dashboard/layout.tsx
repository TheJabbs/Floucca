"use client";

import React, { ReactNode } from "react";
import { StatsDataProvider } from "@/contexts/StatsDataContext";
import { SharedStatsProvider } from "@/contexts/SharedStatContext";
import ReportsLeftPanel from "@/components/panels/stat-sidebar";

interface StatsLayoutProps {
  children: ReactNode;
}

export default function StatsLayout({ children }: StatsLayoutProps) {
  return (
    <StatsDataProvider>
      <SharedStatsProvider>
        <div className="flex h-full">
          <div className="flex h-screen">
            <ReportsLeftPanel />
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </SharedStatsProvider>
    </StatsDataProvider>
  );
}
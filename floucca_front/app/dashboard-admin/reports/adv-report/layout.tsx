"use client";

import React, { ReactNode } from "react";
import { SharedStatsProvider } from "@/contexts/TabsContext";

interface StatsLayoutProps {
  children: ReactNode;
}

export default function StatsLayout({ children }: StatsLayoutProps) {
  return (
      <SharedStatsProvider>
          <div className="flex-1 p-6 overflow-y-auto">
            {children}
          </div>
    </SharedStatsProvider>
  );
}
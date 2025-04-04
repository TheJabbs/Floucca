"use client";

import React from "react";
import FleetSensesReportTable from "@/components/stats/tables/fleetsensesreporttable"; // Adjust path if needed
import { StatsDataProvider } from "@/contexts/StatsDataContext"; // make sure path is correct

const FleetSensesReportPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <StatsDataProvider>
        <FleetSensesReportTable />
      </StatsDataProvider>
    </main>
  );
};

export default FleetSensesReportPage;

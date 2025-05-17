"use client";

import React from "react";
import ReusableTable from "./table";

interface LandingsData {
  records: number;
  avgPrice: number;
  estValue: number;
  cpue: number;
  estCatch: number;
  sampleCatch: number;
}

interface LandingsTableProps {
  isLoading: boolean;
  landingsData: LandingsData;
}

const LandingsTable: React.FC<LandingsTableProps> = ({ isLoading, landingsData }) => {
  // Define columns for the table
  const columns = [
    { key: "records", header: "Records" },
    { key: "avgPrice", header: "Avg. Price" },
    { key: "estValue", header: "Est. Value" },
    { key: "cpue", header: "CPUE" },
    { key: "estCatch", header: "Est. Catch" },
    { key: "sampleCatch", header: "Sample Catch" },
  ];

  // Convert object data to array format for the reusable table
  const dataArray = landingsData ? [landingsData] : [];

  return (
    <ReusableTable
      title="Landings"
      columns={columns}
      data={dataArray}
      isLoading={isLoading}
      noDataMessage="No landings data available."
    />
  );
};

export default LandingsTable;
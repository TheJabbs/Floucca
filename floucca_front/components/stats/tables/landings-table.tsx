import React from "react";
import ReusableTable from "../../utils/table";

interface LandingsData {
  records: number;
  avgPrice: number;
  estValue: number;
  cpue: number;
  estCatch: number;
  sampleEffort: number;
}

interface LandingsTableProps {
  isLoading: boolean;
  landingsData: LandingsData;
}

const LandingsTable: React.FC<LandingsTableProps> = ({ isLoading, landingsData }) => {
  // Define columns for the table
  const columns = [
    { key: "records", header: "Records" },
    { key: "avgPrice", header: "Average Price" },
    { key: "estValue", header: "Estimated Value" },
    { key: "cpue", header: "CPUE" },
    { key: "estCatch", header: "Estimated Catch" },
    { key: "sampleEffort", header: "Sample Effort" },
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
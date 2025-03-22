import React from "react";
import ReusableTable from "../../utils/table";

interface EffortData {
  records: number;
  gears: number;
  activeDays: number;
  pba: number;
  estEffort: number;
}

interface EffortTableProps {
  isLoading: boolean;
  effortData: EffortData;
}

const EffortTable: React.FC<EffortTableProps> = ({ isLoading, effortData }) => {
  // Define columns for the table
  const columns = [
    { key: "records", header: "Records" },
    { key: "gears", header: "Boats/Gears" },
    { key: "activeDays", header: "Active Days" },
    { key: "pba", header: "PBA" },
    { key: "estEffort", header: "Estimated Effort" },
  ];

  // Convert object data to array format for the reusable table
  const dataArray = effortData ? [effortData] : [];

  return (
    <ReusableTable
      title="Effort (WEEKLY)"
      columns={columns}
      data={dataArray}
      isLoading={isLoading}
      noDataMessage="No effort data available."
    />
  );
};

export default EffortTable;
"use client";

import React, { useState } from "react";
import ReusableTable from "./table";
import SpeciesBarChart from "../charts/species-bar-chart";
import { BarChart2 } from "lucide-react";

interface SpeciesData {
  specie_name: string;
  numbOfCatch: number;
  avgPrice: number;
  avgWeight: number;
  avgLength: number;
  avgQuantity: number
  value: number;
  cpue: number;
  estCatch: number;
  effort: number;
}

interface SpeciesTableProps {
  isLoading: boolean;
  statsData: SpeciesData[] | null;
}

const SpeciesTable: React.FC<SpeciesTableProps> = ({ isLoading, statsData }) => {
  const [showChart, setShowChart] = useState(false);

  // Define columns for the table
  const columns = [
    { key: "specie_name", header: "Species" },
    { key: "numbOfCatch", header: "N. catch" },
    { key: "avgPrice", header: "Avg. Price" },
    { key: "avgWeight", header: "Avg.Weight (kg)" },
    { key: "avgLength", header: "Avg.Length (cm)" },
    { key: "avgQuantity", header: "Avg. Quantity" },
    { key: "value", header: "Value" },
    { key: "cpue", header: "CPUE" },
    { key: "estCatch", header: "Est. catch" },
    { key: "effort", header: "Effort" },
  ];

  const toggleChart = () => {
    setShowChart(!showChart);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Fishing Data</h3>
        <button
          onClick={toggleChart}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            showChart
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          title={showChart ? "Hide chart view" : "Show chart view"}
        >
          <BarChart2 className="w-4 h-4" />
          <span>{showChart ? "Hide Chart" : "View Chart"}</span>
        </button>
      </div>

      <ReusableTable
        columns={columns}
        data={statsData}
        isLoading={isLoading}
        noDataMessage="No species data available."
        keyExtractor={(item) => item.specie_name}
      />

      {showChart && <SpeciesBarChart data={statsData || []} isLoading={isLoading} />}
    </div>
  );
};

export default SpeciesTable;
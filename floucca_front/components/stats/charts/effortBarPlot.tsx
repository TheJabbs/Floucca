import React, { useState } from "react";
import { ScatterChart } from "@mui/x-charts/ScatterChart";

interface EffortBarPlotProps {
  data: any[];
  isLoading: boolean;
}

const EffortBarPlot: React.FC<EffortBarPlotProps> = ({ data, isLoading }) => {
  const [selectedMetric, setSelectedMetric] = useState<
    "records" | "gears" | "activeDays" | "pba" | "estEffort"
  >("records");

  const colors: Record<"records" | "gears" | "activeDays" | "pba" | "estEffort", string> = {
    records: "#6366f1",
    gears: "#22c55e",
    activeDays: "#f59e0b",
    pba: "#ec4899",
    estEffort: "#3b82f6",
  };

  const prepareChartData = () => {
    if (!data || data.length === 0) return [];

    return data.map((item, index) => ({
      x: index + 1,
      y: item[selectedMetric] ?? 0, 
      id: index,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
        No data available for effort visualization
      </div>
    );
  }

  const dataset = prepareChartData();
  console.log("Dataset for ScatterChart:", dataset); 

  return (
    <div className="mt-6">
      <div className="mb-4 flex justify-center space-x-2">
        {Object.keys(colors).map((metric) => (
          <button
            key={metric}
            onClick={() =>
              setSelectedMetric(metric as "gears" | "records" | "activeDays" | "pba" | "estEffort")
            }
            className={`px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200`}
            style={{
              backgroundColor: selectedMetric === metric ? colors[metric] : "",
              color: selectedMetric === metric ? "white" : "",
            }}
          >
            {metric.charAt(0).toUpperCase() + metric.slice(1)}
          </button>
        ))}
      </div>

      <div className="mx-auto" style={{ width: "100%", maxWidth: "900px" }}>
        <ScatterChart
          xAxis={[{ scaleType: "linear", dataKey: "x", label: "Entries" }]}
          series={[
            {
              data: dataset, 
              label: selectedMetric,
              color: colors[selectedMetric],
            },
          ]}
          height={400}
        />
      </div>
    </div>
  );
};

export default EffortBarPlot;

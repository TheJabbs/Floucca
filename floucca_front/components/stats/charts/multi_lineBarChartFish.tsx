import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FishStatInterface } from "../../../../floucca_back/src/backend/fish/interface/fish_stat.interface";

interface MultiLineBarChartFishProps {
  fishStats: Record<string, Record<number, FishStatInterface>>;
}

interface ChartData {
  period: string;
  specie_code: number;
  value: number; // Ensuring it's always a number
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const METRICS: { key: keyof FishStatInterface; label: string }[] = [
  { key: "avg_quantity", label: "Quantity" },
  { key: "avg_weight", label: "Weight" },
  { key: "avg_length", label: "Length" },
  { key: "avg_price", label: "Price" },
];

const MultiLineBarChartFish: React.FC<MultiLineBarChartFishProps> = ({ fishStats }) => {
  const [selectedMetric, setSelectedMetric] = useState<keyof FishStatInterface>("avg_quantity");

  const processedData: ChartData[] = Object.entries(fishStats).flatMap(([period, species]) =>
    Object.entries(species).map(([specieCode, stats]) => ({
      period: formatDate(period),
      specie_code: Number(specieCode),
      value: stats[selectedMetric] as number, 
    }))
  );

  const uniqueSpecies = Array.from(new Set(processedData.map((data) => data.specie_code)));

  return (
    <div>
      <h2>Fish Statistics Over Time</h2>
      
      <select onChange={(e) => setSelectedMetric(e.target.value as keyof FishStatInterface)}>
        {METRICS.map((metric) => (
          <option key={metric.key} value={metric.key}>
            {metric.label}
          </option>
        ))}
      </select>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={processedData}>
          <XAxis dataKey="period" />
          <YAxis label={{ value: selectedMetric.replace("avg_", ""), angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />

          {uniqueSpecies.map((specie, index) => (
            <Line
              key={specie}
              type="monotone"
              dataKey="value"
              stroke={COLORS[index % COLORS.length]}
              name={`Species ${specie}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiLineBarChartFish;

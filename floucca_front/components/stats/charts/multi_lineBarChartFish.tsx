import React from "react";
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
  avg_quantity: number;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; 

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const MultiLineBarChartFish: React.FC<MultiLineBarChartFishProps> = ({ fishStats }) => {
  const processedData: ChartData[] = [];

  Object.entries(fishStats).forEach(([period, species]) => {
    Object.entries(species).forEach(([specieCode, stats]) => {
      processedData.push({
        period: formatDate(period), // Format period as Month Day, Year
        specie_code: Number(specieCode),
        avg_quantity: stats.avg_quantity,
      });
    });
  });

  // Get all unique species codes
  const uniqueSpecies = Array.from(new Set(processedData.map((data) => data.specie_code)));

  return (
    <div>
      <h2>Fish Quantity Over Time by Species</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={processedData}>
          <XAxis dataKey="period" />
          <YAxis label={{ value: "Quantity", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          {uniqueSpecies.map((specie, index) => (
            <Line
              key={specie}
              type="monotone"
              dataKey="avg_quantity"
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

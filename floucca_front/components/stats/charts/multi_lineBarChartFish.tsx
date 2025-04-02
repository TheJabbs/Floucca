import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FishStatInterface } from "../../../../floucca_back/src/backend/fish/interface/fish_stat.interface";

interface MultiLineBarChartFishProps {
  fishStats: Record<string, Record<number, FishStatInterface>>;
}

interface ChartData {
  period: string;
  specie_name: string;
  avg_quantity: number;
  avg_weight: number;
  avg_length: number;
  avg_price: number;
}

const MultiLineBarChartFish: React.FC<MultiLineBarChartFishProps> = ({ fishStats }) => {
  const processedData: ChartData[] = [];

  Object.entries(fishStats).forEach(([period, species]) => {
    Object.entries(species).forEach(([specieCode, stats]) => {
      processedData.push({
        period,
        specie_name: stats.specie_name,
        avg_quantity: stats.avg_quantity,
        avg_weight: stats.avg_weight,
        avg_length: stats.avg_length,
        avg_price: stats.avg_price,
      });
    });
  });

  return (
    <div>
      <h2>Fish Statistics Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={processedData}>
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="avg_quantity" stroke="#8884d8" name="Avg Quantity" />
          <Line type="monotone" dataKey="avg_weight" stroke="#82ca9d" name="Avg Weight" />
          <Line type="monotone" dataKey="avg_length" stroke="#ffc658" name="Avg Length" />
          <Line type="monotone" dataKey="avg_price" stroke="#ff7300" name="Avg Price" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiLineBarChartFish;

"use client";

import React, { useState, useMemo } from "react";
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
  fishStats: Record<string, Record<string, FishStatInterface>>;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28AE5",
  "#FF6F91",
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const METRICS: { key: keyof FishStatInterface; label: string }[] = [
  { key: "avg_quantity", label: "Quantity" },
  { key: "avg_weight", label: "Weight (kg)" },
  { key: "avg_length", label: "Length (cm)" },
  { key: "avg_price", label: "Price (L.L.)" },
];

const MultiLineBarChartFish: React.FC<MultiLineBarChartFishProps> = ({ fishStats }) => {
  const [selectedMetric, setSelectedMetric] = useState<keyof FishStatInterface>("avg_quantity");

  const chartData = useMemo(() => {
    const dataMap: Record<string, Record<string, any>> = {};

    for (const [period, species] of Object.entries(fishStats)) {
      const formattedDate = formatDate(period);
      if (!dataMap[formattedDate]) {
        dataMap[formattedDate] = { period: formattedDate };
      }

      for (const [, stats] of Object.entries(species)) {
        const value = stats[selectedMetric];
        const numericValue = typeof value === "number" ? value : 0;
        const roundedValue = Math.round(numericValue / 10) * 10;
        dataMap[formattedDate][stats.specie_name] = roundedValue;

      }
    }

    return Object.values(dataMap);
  }, [fishStats, selectedMetric]);

  const allSpecies = useMemo(() => {
    const names = new Set<string>();
    Object.values(fishStats).forEach((species) => {
      Object.values(species).forEach((s) => names.add(s.specie_name));
    });
    return Array.from(names);
  }, [fishStats]);

  const formatTooltipValue = (value: number) => {
    const rounded = Math.round(value / 10) * 10;
    return selectedMetric === "avg_price" ? `${rounded.toLocaleString()} L.L.` : rounded;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Fish Statistics Over Time</h2>

      <select
        onChange={(e) => setSelectedMetric(e.target.value as keyof FishStatInterface)}
        className="mb-4 border p-2 rounded shadow"
      >
        {METRICS.map((metric) => (
          <option key={metric.key} value={metric.key}>
            {metric.label}
          </option>
        ))}
      </select>

      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={chartData}>
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip formatter={formatTooltipValue} />
          <Legend />

          {allSpecies.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              name={name}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiLineBarChartFish;

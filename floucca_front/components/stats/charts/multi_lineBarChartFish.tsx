"use client";

import React, { useEffect, useState } from "react";
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

interface ChartDataEntry {
  period: string;
  [specieName: string]: string | number;
}

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300",
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const METRICS: { key: keyof FishStatInterface; label: string; unit?: string }[] = [
  { key: "avg_quantity", label: "Quantity" },
  { key: "avg_weight", label: "Weight" },
  { key: "avg_length", label: "Length" },
  { key: "avg_price", label: "Price", unit: "L.L." },
];

const MultiLineBarChartFish: React.FC<MultiLineBarChartFishProps> = ({ fishStats }) => {
  const [selectedMetric, setSelectedMetric] = useState<keyof FishStatInterface>("avg_quantity");
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);

  const allSpecies = Array.from(
    new Set(
      Object.values(fishStats)
        .flatMap((periodData) => Object.values(periodData))
        .map((stat) => stat.specie_name)
    )
  );

  useEffect(() => {
    setSelectedSpecies(allSpecies);
  }, [fishStats]);

  const chartData: ChartDataEntry[] = Object.entries(fishStats).map(
    ([period, species]) => {
      const entry: ChartDataEntry = {
        period: formatDate(period),
      };

      Object.values(species).forEach((stat) => {
        const value = stat[selectedMetric];
        const rounded =
          typeof value === "number" ? Math.round(value / 10) * 10 : 0;

        if (selectedMetric === "avg_price") {
          entry[stat.specie_name] = `${rounded} L.L.`;
        } else {
          entry[stat.specie_name] = rounded;
        }
      });

      return entry;
    }
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Fish Statistics Over Time</h2>

        // SELECTOR FOR THE Y AXIS ATTRIBUTES FOR THE CHART
      <div className="mb-4">
        <label htmlFor="metricSelect" className="mr-2 font-semibold">
          Select Metric:
        </label>
        <select
          id="metricSelect"
          value={selectedMetric}
          onChange={(e) =>
            setSelectedMetric(e.target.value as keyof FishStatInterface)
          }
          className="border border-gray-300 rounded px-2 py-1"
        >
          {METRICS.map((metric) => (
            <option key={metric.key} value={metric.key}>
              {metric.label}
            </option>
          ))}
        </select>
      </div>
            //SPECIE SELECTOR FOR THE CHART 
            //note that this is not tested !
      <div className="flex flex-wrap gap-3 mb-4">
        {allSpecies.map((specie) => (
          <label key={specie} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedSpecies.includes(specie)}
              onChange={() =>
                setSelectedSpecies((prev) =>
                  prev.includes(specie)
                    ? prev.filter((s) => s !== specie)
                    : [...prev, specie]
                )
              }
            />
            <span>{specie}</span>
          </label>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <XAxis dataKey="period" />
          <YAxis
            label={{
              value: selectedMetric.replace("avg_", ""),
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />

          {selectedSpecies.map((specie, index) => (
            <Line
              key={specie}
              type="monotone"
              dataKey={specie}
              stroke={COLORS[index % COLORS.length]}
              name={specie}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiLineBarChartFish;

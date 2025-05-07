import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { fishService, FishStat } from "@/services/fishService";

interface Props {
  filter: any;
}

const yAxisOptions = ["quantity", "weight", "price"] as const;
type YAxisOption = typeof yAxisOptions[number];

export default function MultiLineBarChartFish({ filter }: Props) {
  const [data, setData] = useState<FishStat[]>([]);
  const [visibleSpecies, setVisibleSpecies] = useState<string[]>([]);
  const [yAxisKey, setYAxisKey] = useState<YAxisOption>("quantity");

  useEffect(() => {
    fishService.getFishStats(filter).then((fetchedData) => {
      setData(fetchedData);
      const uniqueSpecies = Array.from(new Set(fetchedData.map((d) => d.specie_name)));
      setVisibleSpecies(uniqueSpecies);
    });
  }, [filter]);

  const handleToggleSpecies = (specie: string) => {
    setVisibleSpecies((prev) =>
      prev.includes(specie)
        ? prev.filter((s) => s !== specie)
        : [...prev, specie]
    );
  };


  const groupedData = Array.from(
    new Map(
      data.map((d) => [d.period_date, { ...d }])
    ).values()
  );
  const filteredSpecies = Array.from(
    new Set(
      groupedData.map((d) => d.specie_name).filter(Boolean)
    )
  );
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <label>
          <strong>Y-axis:</strong>
          <select
            className="ml-2 p-1 border rounded"
            value={yAxisKey}
            onChange={(e) => setYAxisKey(e.target.value as YAxisOption)}
          >
            {yAxisOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-2">
          {filteredSpecies.map((specie) => (
            <label key={specie} className="flex items-center space-x-1 text-sm">
              <input
                type="checkbox"
                checked={visibleSpecies.includes(specie)}
                onChange={() => handleToggleSpecies(specie)}
              />
              <span>{specie}</span>
            </label>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={groupedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period_date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {visibleSpecies.map((specie, idx) => (
            <Line
              key={specie}
              type="monotone"
              dataKey={(entry: any) => {
                const match = data.find(
                  (d) => d.specie_name === specie && d.period_date === entry.period_date
                );
                return match ? match[yAxisKey] : null;
              }}
              name={specie}
              stroke={`hsl(${(idx * 75) % 360}, 70%, 50%)`}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { fishService } from '@/services/fishService';

interface FishStat {
  period_date: string;
  specie_name: string;
  quantity: number;
}

interface GeneralFilterDto {
  period: string;
  port_id?: number[];
  coop?: number[];
  region?: number[];
  gear_code?: number[];
}

interface Props {
  filter: GeneralFilterDto;
}

export default function FishMultiLineChart({ filter }: Props) {
  const [fishData, setFishData] = useState<FishStat[]>([]);
  const [species, setSpecies] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fishService.getFishStats(filter);
      console.log('Fetched data:', data); 
      setFishData(data);
      const uniqueSpecies = Array.from(new Set(data.map(f => f.specie_name)));
      setSpecies(uniqueSpecies);
    };

    fetchData();
  }, [filter]);

  // grouping all species per period_date
  const structuredData = Object.values(
    fishData.reduce((acc, stat) => {
      const date = stat.period_date;
      if (!acc[date]) acc[date] = { period_date: date };
      acc[date][stat.specie_name] = stat.quantity;
      return acc;
    }, {} as Record<string, any>)
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={structuredData}>
        <XAxis dataKey="period_date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {species.map((name, index) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

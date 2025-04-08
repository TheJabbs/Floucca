'use client';

import { useEffect, useState } from 'react';
import FishStatsChart from '@/components/stats/charts/multi_lineBarChartFish';

interface FishStat {
  specie_name: string;
  avg_length: number;
  avg_weight: number;
  avg_price: number;
  avg_quantity: number;
}

interface FishStats {
  [period: string]: {
    [specieId: string]: FishStat;
  };
}

const filter = {
  period: new Date().toISOString(),
  port_id: [1],
};

export default function FishStatsPage() {
  const [fishStats, setFishStats] = useState<FishStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = process.env.API_URL;
        const response = await fetch(`${baseURL}/api/fish/stats/avg`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(filter),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch fish stats');
        }

        const data = await response.json();
        console.log('Fetched fish stats:', data);

        setFishStats(data); 
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : ' unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading fish statistics...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fish Statistics</h1>
      {fishStats ? <FishStatsChart fishStats={fishStats} /> : <p>No data available</p>}
    </div>
  );
}

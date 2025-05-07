'use client';

import FishMultiLineChart from '@/components/stats/charts/multi_lineBarChartFish';

const filter = {
  period: new Date().toISOString(), // ISO format
  port_id: [1], // example port
};

export default function FishStatsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fish Statistics</h1>
      <FishMultiLineChart filter={filter} />
    </div>
  );
}

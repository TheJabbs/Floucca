'use client';

import FishMultiLineChart from '@/components/stats/charts/fish-stats';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/navigators/tabs';
import {ChartBarIcon, MapIcon} from 'lucide-react';
import FishStatisticsChart from "@/components/stats/charts/fish-stats";

const SpeciesCoordinatesVisualization = dynamic(
  () => import('@/components/stats/maps/species-coord-visualization'),
  { ssr: false, loading: () => <div className="h-80 bg-gray-100 animate-pulse rounded-lg" /> }
);

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
  const [activeTab, setActiveTab] = useState("charts");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
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
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Species Analytics</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4" />
            <span>Trend Charts</span>
          </TabsTrigger>
          <TabsTrigger value="maps" className="flex items-center gap-2">
            <MapIcon className="h-4 w-4" />
            <span>Geographic Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Species Trends Over Time</h2>
            <p className="text-gray-600 mb-6">
              Track monthly species metrics using line charts showing average weight, 
              length, quantity, and price trends over time.
            </p>
            {loading && <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
            {fishStats && !loading &&  <FishStatisticsChart />}
          </div>
        </TabsContent>

        <TabsContent value="maps" className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Species Geographic Distribution</h2>
            <p className="text-gray-600 mb-6">
              Visualize where different species are being caught using convex hull analysis 
              and heat maps to identify fishing zones and concentration areas.
            </p>
            <SpeciesCoordinatesVisualization />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

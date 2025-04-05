'use client';

import { useEffect, useState } from 'react';
import FishStatsChart from '@/components/stats/charts/multi_lineBarChartFish'; 

export default function FishStatsPage() {
    const [fishStats, setFishStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/fish/stats/avg");
                if (!response.ok) {
                    throw new Error("Failed to fetch fish stats");
                }
                const data = await response.json();
                setFishStats(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
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
            {fishStats && <FishStatsChart fishStats={fishStats} />}
        </div>
    );
}

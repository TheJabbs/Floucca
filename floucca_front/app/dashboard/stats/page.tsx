"use client";
import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useStatsData } from "@/contexts/StatsDataContext";
import EffortTable from "@/components/stats/tables/effort-table";
import LandingsTable from "@/components/stats/tables/landings-table";
import SpeciesTable from "@/components/stats/tables/species-table";
import { fetchStatisticsData, mapSpeciesData } from "@/services/statsService";

const StatsPage: React.FC = () => {
  // Get data from context
  const { gears, ports, formattedPeriods, species, isLoading, error } = useStatsData();

  // Filter states - initialized with empty/default values
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedGear, setSelectedGear] = useState<number>(0);
  const [selectedPort, setSelectedPort] = useState<number>(0);

  // Data state
  const [effortData, setEffortData] = useState({
    records: 0,
    gears: 0,
    activeDays: 0,
    pba: 0,
    estEffort: 0,
  });

  const [landingsData, setLandingsData] = useState({
    records: 0,
    avgPrice: 0,
    estValue: 0,
    cpue: 0,
    estCatch: 0,
    sampleEffort: 0,
  });

  const [statsData, setStatsData] = useState<any[]>([]);
  
  // Loading states
  const [isEffortLoading, setIsEffortLoading] = useState(false);
  const [isLandingsLoading, setIsLandingsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Create a species map for lookup
  const speciesMap: Record<number, string> = {};
  species?.forEach(s => {
    speciesMap[s.specie_code] = s.specie_name;
  });

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value);
  };

  const handleGearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGear(Number(e.target.value));
  };
  
  const handlePortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPort(Number(e.target.value));
  };

  const areFiltersSelected = () => {
    return selectedPeriod !== "" && selectedGear !== 0 && selectedPort !== 0;
  };

  const fetchData = async () => {
    if (!areFiltersSelected()) return;

    setIsEffortLoading(true);
    setIsLandingsLoading(true);
    setIsStatsLoading(true);
    setFetchError(null);

    try {
      const filter = {
        period: selectedPeriod,
        gear_code: [selectedGear],
        port_id: [selectedPort]
      };

      const data = await fetchStatisticsData(filter);
      
      // Update state with the fetched data
      setEffortData(data.uperTable.effort);
      setLandingsData(data.uperTable.landings);
      setStatsData(mapSpeciesData(data.lowerTable, speciesMap));
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setFetchError(typeof error === 'string' ? error : 'Failed to fetch statistics data');
    } finally {
      setIsEffortLoading(false);
      setIsLandingsLoading(false);
      setIsStatsLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    if (areFiltersSelected()) {
      fetchData();
    }
  }, [selectedPeriod, selectedGear, selectedPort]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <h1 className="text-2xl font-bold">Fishing Statistics</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            disabled={!areFiltersSelected()}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm ${
              areFiltersSelected() 
                ? "bg-blue-100 text-blue-800 hover:bg-blue-200" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:gap-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="period"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Time Period
              </label>
              <select
                id="period"
                value={selectedPeriod}
                onChange={handlePeriodChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select a period</option>
                {formattedPeriods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="gear"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gear Type
              </label>
              <select
                id="gear"
                value={selectedGear}
                onChange={handleGearChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value={0}>Select a gear</option>
                {gears.map((gear) => (
                  <option key={gear.gear_code} value={gear.gear_code}>
                    {gear.gear_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label
                htmlFor="port"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Port
              </label>
              <select
                id="port"
                value={selectedPort}
                onChange={handlePortChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value={0}>Select a port</option>
                {ports.map((port) => (
                  <option key={port.port_id} value={port.port_id}>
                    {port.port_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {fetchError && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
            <p>{fetchError}</p>
          </div>
        )}

        {areFiltersSelected() ? (
          <>
            <div className="bg-white p-4 rounded-lg border shadow-sm overflow-x-auto">
              <EffortTable isLoading={isEffortLoading} effortData={effortData} />
              <div className="border-t border-gray-300 my-4"></div>
              <LandingsTable isLoading={isLandingsLoading} landingsData={landingsData} />
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm overflow-x-auto">
              <SpeciesTable isLoading={isStatsLoading} statsData={statsData} />
            </div>
          </>
        ) : (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-center">
            Please select a time period, gear type, and port to view statistics.
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
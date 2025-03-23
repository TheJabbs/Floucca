"use client";
import React, { useState, useEffect } from "react";
import { Filter, X, Check, Loader2 } from "lucide-react";
import { useStatsData } from "@/contexts/StatsDataContext";
import { fetchEffortAndLanding, EffortData, LandingsData, GeneralFilterDto } from "@/services/statsService";
import EffortTable from "@/components/stats/tables/effort-table";
import LandingsTable from "@/components/stats/tables/landings-table";

const StatsPage: React.FC = () => {
  const { gears, ports, regions, coops, formattedPeriods, isLoading, error } = useStatsData();

  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedGear, setSelectedGear] = useState<number>(0);
  const [activeFilterType, setActiveFilterType] = useState<"port" | "region" | "coop">("port");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [effortData, setEffortData] = useState<EffortData | null>(null);
  const [landingsData, setLandingsData] = useState<LandingsData | null>(null);
  const [isEffortLoading, setIsEffortLoading] = useState(false);
  const [isLandingsLoading, setIsLandingsLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && formattedPeriods.length > 0 && selectedPeriod === "") {
      setSelectedPeriod(formattedPeriods[0].value);
    }
    if (!isLoading && gears.length > 0 && selectedGear === 0) {
      setSelectedGear(gears[0].gear_code);
    }
  }, [isLoading, formattedPeriods, gears, selectedPeriod, selectedGear]);

  const handleFetchData = async () => {
    setIsEffortLoading(true);
    setIsLandingsLoading(true);

    const filter: GeneralFilterDto = {
      period: selectedPeriod,
      gear_code: [selectedGear],
      ...(activeFilterType === "port" && { port_id: selectedFilters.map(Number) }),
      ...(activeFilterType === "region" && { region: selectedFilters.map(Number) }),
      ...(activeFilterType === "coop" && { coop: selectedFilters.map(Number) }),
    };

    const response = await fetchEffortAndLanding(filter);

    if (response) {
      setEffortData(response.effort);
      setLandingsData(response.landings);
    }

    setIsEffortLoading(false);
    setIsLandingsLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <h1 className="text-2xl font-bold">Fishing Statistics</h1>
        <button 
          onClick={handleFetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Fetch Data
        </button>
      </div>

      <EffortTable isLoading={isEffortLoading} effortData={effortData || { records: 0, gears: 0, activeDays: 0, pba: 0, estEffort: 0 }} />

      <LandingsTable isLoading={isLandingsLoading} landingsData={landingsData || { records: 0, avgPrice: 0, estValue: 0, cpue: 0, estCatch: 0, sampleEffort: 0 }} />
    </div>
  );
};

export default StatsPage;

"use client";
import React, { useState, useEffect } from "react";
import { Filter, X, Check } from "lucide-react";
import { useStatsData } from "@/contexts/StatsDataContext";
import EffortTable from "@/components/stats/tables/effort-table";
import LandingsTable from "@/components/stats/tables/landings-table";
import SpeciesTable from "@/components/stats/tables/species-table";

// Define interfaces to ensure type safety
interface SpeciesData {
  species: string;
  averageWeight: number;
  fishCount: number;
  price: number;
  value: number;
  cpue: number;
  estCatch: number;
}

const StatsPage: React.FC = () => {
  // Get data from context
  const { gears, ports, regions, coops, formattedPeriods, isLoading, error } =
    useStatsData();

  // Filter states
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedGear, setSelectedGear] = useState<number>(0);
  const [activeFilterType, setActiveFilterType] = useState<
    "port" | "region" | "coop"
  >("port");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Effort and Landings Data (Static for now, ready for API fetching)
  const [effortData, setEffortData] = useState({
    records: 24,
    gears: 100,
    activeDays: 31,
    pba: 0.994,
    estEffort: 3082,
  });

  const [landingsData, setLandingsData] = useState({
    records: 23,
    avgPrice: 6058.47,
    estValue: 259586892,
    cpue: 13.9,
    estCatch: 42847,
    sampleEffort: 23,
  });

  // Species data with proper typing
  const [statsData, setStatsData] = useState([
    {
      species: "Sea Bass",
      averageWeight: 1.2,
      fishCount: 1450,
      price: 15000,
      value: 21750000,
      cpue: 7.8,
      estCatch: 11310,
    },
    {
      species: "Cod",
      averageWeight: 2.5,
      fishCount: 980,
      price: 22000,
      value: 53900000,
      cpue: 10.3,
      estCatch: 10094,
    },
  ]);
  
  const [isEffortLoading, setIsEffortLoading] = useState(false);
  const [isLandingsLoading, setIsLandingsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // Set initial selections when data is loaded
  useEffect(() => {
    if (!isLoading && formattedPeriods.length > 0 && selectedPeriod === "") {
      setSelectedPeriod(formattedPeriods[0].value);
    }

    if (!isLoading && gears.length > 0 && selectedGear === 0) {
      setSelectedGear(gears[0].gear_code);
    }
  }, [isLoading, formattedPeriods, gears, selectedPeriod, selectedGear]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value);
  };

  const handleGearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGear(Number(e.target.value));
  };

  const handleFilterTypeChange = (type: "port" | "region" | "coop") => {
    if (type !== activeFilterType) {
      setActiveFilterType(type);
      setSelectedFilters([]);
    }
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const applyFilters = () => {
    console.log("Applied filters:", {
      period: selectedPeriod,
      gear: selectedGear,
      filterType: activeFilterType,
      filters: selectedFilters,
    });

    setIsFilterPanelOpen(false);
    setIsStatsLoading(true);
    setIsEffortLoading(true);
    setIsLandingsLoading(true);
  };

  const getCurrentFilterOptions = () => {
    switch (activeFilterType) {
      case "port":
        return ports.map((port) => ({
          id: port.port_id.toString(),
          name: port.port_name,
        }));
      case "region":
        return regions.map((region) => ({
          id: region.region_code.toString(),
          name: region.region_name,
        }));
      case "coop":
        return coops.map((coop) => ({
          id: coop.coop_code.toString(),
          name: coop.coop_name,
        }));
      default:
        return [];
    }
  };

  const getFilterTypeLabel = () => {
    switch (activeFilterType) {
      case "port":
        return "Ports";
      case "region":
        return "Regions";
      case "coop":
        return "Cooperatives";
    }
  };

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
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-1 hover:bg-blue-200 text-sm"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:gap-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {gears.map((gear) => (
                  <option key={gear.gear_code} value={gear.gear_code}>
                    {gear.gear_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isFilterPanelOpen && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Filters</h2>
              <button
                onClick={() => setIsFilterPanelOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    activeFilterType === "port"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => handleFilterTypeChange("port")}
                >
                  by Port
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    activeFilterType === "region"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => handleFilterTypeChange("region")}
                >
                  by Region
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    activeFilterType === "coop"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => handleFilterTypeChange("coop")}
                >
                  by Cooperative
                </button>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Select {getFilterTypeLabel()}:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getCurrentFilterOptions().map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleFilter(option.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                        selectedFilters.includes(option.id)
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {selectedFilters.includes(option.id) && (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white p-4 rounded-lg border shadow-sm overflow-x-auto">
        <EffortTable isLoading={isEffortLoading} effortData={effortData} />
        <div className="border-t border-gray-300 my-4"></div>
        <LandingsTable isLoading={isLandingsLoading} landingsData={landingsData} />
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm overflow-x-auto">
        <SpeciesTable isLoading={isStatsLoading} statsData={statsData} />
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
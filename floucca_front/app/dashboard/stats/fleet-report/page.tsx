"use client";
import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useStatsData } from "@/contexts/StatsDataContext";
import { fetchFleetReport, FleetReportData } from "@/services/fleetReportService";
import FleetUsageTable from "@/components/stats/tables/fleet-table";

interface FormattedGearData {
  gear_code: number;
  gear_name: string;
  jan?: { freq: number; activeDays: number };
  feb?: { freq: number; activeDays: number };
  mar?: { freq: number; activeDays: number };
  apr?: { freq: number; activeDays: number };
  may?: { freq: number; activeDays: number };
  jun?: { freq: number; activeDays: number };
  jul?: { freq: number; activeDays: number };
  aug?: { freq: number; activeDays: number };
  sep?: { freq: number; activeDays: number };
  oct?: { freq: number; activeDays: number };
  nov?: { freq: number; activeDays: number };
  dec?: { freq: number; activeDays: number };
}

type TabType = 'frequency' | 'activeDays';

const FleetReportPage: React.FC = () => {
  const { ports, regions, coops, isLoading, error } = useStatsData();

  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [filterType, setFilterType] = useState<"port" | "region" | "coop">("port");
  const [selectedPorts, setSelectedPorts] = useState<number[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<number[]>([]);
  const [selectedCoops, setSelectedCoops] = useState<number[]>([]);
  const [reportData, setReportData] = useState<FormattedGearData[]>([]);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<TabType>('frequency');

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 11 }, (_, i) => currentYear - i);

  const togglePort = (portId: number) => {
    if (selectedPorts.includes(portId)) {
      setSelectedPorts(selectedPorts.filter(id => id !== portId));
    } else {
      setSelectedPorts([...selectedPorts, portId]);
    }
  };

  const toggleRegion = (regionId: number) => {
    if (selectedRegions.includes(regionId)) {
      setSelectedRegions(selectedRegions.filter(id => id !== regionId));
    } else {
      setSelectedRegions([...selectedRegions, regionId]);
    }
  };

  const toggleCoop = (coopId: number) => {
    if (selectedCoops.includes(coopId)) {
      setSelectedCoops(selectedCoops.filter(id => id !== coopId));
    } else {
      setSelectedCoops([...selectedCoops, coopId]);
    }
  };

  const areFiltersSelected = () => {
    if (!selectedYear) return false;

    switch (filterType) {
      case 'port':
        return selectedPorts.length > 0;
      case 'region':
        return selectedRegions.length > 0;
      case 'coop':
        return selectedCoops.length > 0;
      default:
        return false;
    }
  };

  const formatDataForTable = (rawData: FleetReportData[]): FormattedGearData[] => {
    const gearMap = new Map<number, FormattedGearData>();
    
    rawData.forEach(item => {
      if (!gearMap.has(item.gear_code)) {
        gearMap.set(item.gear_code, {
          gear_code: item.gear_code,
          gear_name: item.gear_name
        });
      }
      
      const monthMap: { [key: number]: string } = {
        1: 'jan', 2: 'feb', 3: 'mar', 4: 'apr', 5: 'may', 6: 'jun',
        7: 'jul', 8: 'aug', 9: 'sep', 10: 'oct', 11: 'nov', 12: 'dec'
      };
      
      const monthKey = monthMap[item.month];
      if (monthKey) {
        const currentGear = gearMap.get(item.gear_code)!;
        (currentGear[monthKey as keyof FormattedGearData] as { freq: number; activeDays: number }) = {
          freq: item.freq,
          activeDays: item.activeDays
        };
      }
    });
    
    return Array.from(gearMap.values());
  };

  const fetchData = async () => {
    if (!areFiltersSelected()) return;

    setIsReportLoading(true);
    setFetchError(null);

    try {
      const filter = {
        period: selectedYear,
        port_id: filterType === 'port' ? selectedPorts : undefined,
        coop: filterType === 'coop' ? selectedCoops : undefined,
        region: filterType === 'region' ? selectedRegions : undefined,
      };

      const data = await fetchFleetReport(filter);
      const formattedData = formatDataForTable(data);
      setReportData(formattedData);
    } catch (error) {
      console.error("Error fetching fleet report:", error);
      setFetchError(
        typeof error === "string" ? error : "Failed to fetch fleet report data"
      );
    } finally {
      setIsReportLoading(false);
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fleet Gear Usage Report</h1>
        <button
          onClick={fetchData}
          disabled={!areFiltersSelected()}
          className="px-3 py-2 rounded-lg flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="w-full md:w-1/3">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year:</label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a year</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter By:</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setFilterType("port")}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  filterType === "port" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                by Port
              </button>
              <button
                type="button"
                onClick={() => setFilterType("region")}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  filterType === "region" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                by Region
              </button>
              <button
                type="button"
                onClick={() => setFilterType("coop")}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  filterType === "coop" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                by Cooperative
              </button>
            </div>
          </div>
        </div>

        {/* Port Selection */}
        {filterType === "port" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Ports:</label>
            <div className="flex flex-wrap gap-2">
              {ports.map(port => (
                <button
                  key={port.port_id}
                  onClick={() => togglePort(port.port_id)}
                  className={`px-3 py-1 text-sm rounded-lg border ${
                    selectedPorts.includes(port.port_id)
                      ? "bg-blue-100 border-blue-500 text-blue-800"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {port.port_name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Region Selection */}
        {filterType === "region" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Regions:</label>
            <div className="flex flex-wrap gap-2">
              {regions.map(region => (
                <button
                  key={region.region_code}
                  onClick={() => toggleRegion(region.region_code)}
                  className={`px-3 py-1 text-sm rounded-lg border ${
                    selectedRegions.includes(region.region_code)
                      ? "bg-blue-100 border-blue-500 text-blue-800"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {region.region_name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Coop Selection */}
        {filterType === "coop" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Cooperatives:</label>
            <div className="flex flex-wrap gap-2">
              {coops.map(coop => (
                <button
                  key={coop.coop_code}
                  onClick={() => toggleCoop(coop.coop_code)}
                  className={`px-3 py-1 text-sm rounded-lg border ${
                    selectedCoops.includes(coop.coop_code)
                      ? "bg-blue-100 border-blue-500 text-blue-800"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {coop.coop_name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={fetchData}
            disabled={!areFiltersSelected()}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              areFiltersSelected()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Generate Report
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
          <p>{fetchError}</p>
        </div>
      )}

      {/* Using the extracted FleetUsageTable component */}
      <FleetUsageTable 
        data={reportData}
        isLoading={isReportLoading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default FleetReportPage;
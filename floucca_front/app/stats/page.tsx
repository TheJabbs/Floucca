"use client";
import React, { useState } from "react";
import { Filter, X, Check } from "lucide-react";

interface StatsPeriod {
  id: string;
  label: string;
}

interface GearType {
  id: number;
  name: string;
}

interface FilterOption {
  id: string;
  name: string;
  type: 'port' | 'region' | 'coop';
}

// Sample data (to be replaced with real data)
const PERIODS: StatsPeriod[] = [
  { id: "last-week", label: "Last Week" },
  { id: "last-month", label: "Last Month" },
  { id: "last-quarter", label: "Last Quarter" },
  { id: "last-year", label: "Last Year" }
];

const GEARS: GearType[] = [
  { id: 1, name: "Fishing Net" },
  { id: 2, name: "Fishing Rod" },
  { id: 3, name: "Long Line" },
  { id: 4, name: "Trap" }
];

const FILTER_OPTIONS: FilterOption[] = [
  { id: "port-1", name: "Tripoli Port", type: "port" },
  { id: "port-2", name: "Beirut Port", type: "port" },
  { id: "port-3", name: "Sidon Port", type: "port" },
  { id: "region-1", name: "North Lebanon", type: "region" },
  { id: "region-2", name: "Mount Lebanon", type: "region" },
  { id: "region-3", name: "South Lebanon", type: "region" },
  { id: "coop-1", name: "North Coop", type: "coop" },
  { id: "coop-2", name: "Central Coop", type: "coop" },
  { id: "coop-3", name: "South Coop", type: "coop" }
];

const StatsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(PERIODS[0].id);
  const [selectedGear, setSelectedGear] = useState<number>(GEARS[0].id);
  
  const [activeFilterType, setActiveFilterType] = useState<'port' | 'region' | 'coop'>('port');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value);
  };
  const handleGearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGear(Number(e.target.value));
  };

  const handleFilterTypeChange = (type: 'port' | 'region' | 'coop') => {
    if (type !== activeFilterType) {
      setActiveFilterType(type);
      setSelectedFilters([]);
    }
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const applyFilters = () => {
    console.log("Applying filters:", {
      period: selectedPeriod,
      gear: selectedGear,
      filterType: activeFilterType,
      filters: selectedFilters
    });
    setIsFilterPanelOpen(false);
  };

  const getCurrentFilterOptions = () => {
    return FILTER_OPTIONS.filter(option => option.type === activeFilterType);
  };

  const getFilterTypeLabel = () => {
    switch (activeFilterType) {
      case 'port': return 'Ports';
      case 'region': return 'Regions';
      case 'coop': return 'Cooperatives';
    }
  };

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
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                Time Period
              </label>
              <select
                id="period"
                value={selectedPeriod}
                onChange={handlePeriodChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {PERIODS.map(period => (
                  <option key={period.id} value={period.id}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="gear" className="block text-sm font-medium text-gray-700 mb-1">
                Gear Type
              </label>
              <select
                id="gear"
                value={selectedGear}
                onChange={handleGearChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {GEARS.map(gear => (
                  <option key={gear.id} value={gear.id}>
                    {gear.name}
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
                    activeFilterType === 'port' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => handleFilterTypeChange('port')}
                >
                  by Port
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    activeFilterType === 'region' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => handleFilterTypeChange('region')}
                >
                  by Region
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    activeFilterType === 'coop' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => handleFilterTypeChange('coop')}
                >
                  by Cooperative
                </button>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Select {getFilterTypeLabel()}:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getCurrentFilterOptions().map(option => (
                    <button
                      key={option.id}
                      onClick={() => toggleFilter(option.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                        selectedFilters.includes(option.id)
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
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
          <h2 className="text-lg font-medium mb-3">
            Fishing Data
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Johnny
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maya
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Becca
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No data available.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
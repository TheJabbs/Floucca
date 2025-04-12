"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown, Filter, RefreshCw, PanelLeft, Pin } from "lucide-react";
import { useSharedStats } from "@/contexts/SharedStatContext";

const ReportsLeftPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({});
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [showPeriodFilter, setShowPeriodFilter] = useState(false);

  const { 
    statsData, 
    isLoading, 
    error, 
    lastFetched, 
    refreshStats 
  } = useSharedStats();

  // Set initial expanded state for periods when data is loaded
  React.useEffect(() => {
    if (statsData && Object.keys(statsData).length > 0) {
      const periodsState = Object.keys(statsData).reduce((acc, period) => {
        acc[period] = true;  // Default all periods to expanded
        return acc;
      }, {} as Record<string, boolean>);
      
      setExpandedPeriods(periodsState);
    }
  }, [statsData]);

  const togglePeriod = (period: string) => {
    setExpandedPeriods((prev) => ({
      ...prev,
      [period]: !prev[period],
    }));
  };

  const togglePeriodFilter = () => {
    setShowPeriodFilter(!showPeriodFilter);
  };

  const selectPeriod = (period: string | null) => {
    setSelectedPeriod(period);
    setShowPeriodFilter(false);
  };

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    setIsExpanded(true); 
  };

  // Format date to display more readably
  const formatPeriodDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  // Convert API data to display format
  const getDataRecords = (period: string) => {
    if (!statsData || !statsData[period]) return [];

    const data = statsData[period];
    
    return [
      { type: "Ports", records: data.strata.port },
      { type: "Coops", records: data.strata.coop },
      { type: "Regions", records: data.strata.region },
      { type: "Species", records: data.speciesKind },
      { type: "Effort Records", records: data.effortRecord },
      { type: "Landing Records", records: data.landingRecord },
      { type: "Total Gears", records: data.totalGears },
      { type: "Sample Catch", records: data.sampleCatch },
    ];
  };

  if (isLoading && !statsData && isExpanded) {
    return (
      <div className="bg-white border-r border-gray-200 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Sort periods from latest to oldest
  const periods = statsData 
    ? Object.keys(statsData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) 
    : [];

  return (
    <div
      className={`bg-white border-r border-gray-200 h-full overflow-y-auto transition-all duration-300 ${
        isExpanded ? "w-64" : "w-14"
      } ${isLoading ? "opacity-70" : "opacity-100"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-full flex flex-col">
        {!isExpanded && (
          <div className="flex flex-col items-center p-3">
            <PanelLeft className="h-6 w-6 text-blue-600" />
            <span className="mt-1 text-xs text-gray-600 font-medium">Stats</span>
          </div>
        )}

        {/* Expanded view */}
        {isExpanded && (
          <div className="flex flex-col h-full p-3">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <PanelLeft className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="font-semibold text-lg">Statistics</h2>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={togglePin}
                  className={`p-1.5 rounded-full hover:bg-gray-100 ${isPinned ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}
                  title={isPinned ? "Unpin panel" : "Pin panel"}
                >
                  <Pin size={16} className={isPinned ? "fill-blue-600" : ""} />
                </button>
                <button
                  onClick={togglePeriodFilter}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                  title="Filter by period"
                >
                  <Filter size={16} />
                </button>
                <button
                  onClick={() => refreshStats()}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500" 
                  title="Refresh data"
                  disabled={isLoading}
                >
                  <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {lastFetched && (
              <div className="mb-2 text-xs text-gray-500">
                Last updated: {new Date(lastFetched).toLocaleString()}
              </div>
            )}

            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
                {error}
                <button 
                  className="ml-2 text-red-600 hover:text-red-800 underline text-xs"
                  onClick={() => refreshStats()}
                >
                  Retry
                </button>
              </div>
            )}

            {showPeriodFilter && (
              <div className="mb-4 p-2 bg-gray-50 rounded border">
                <div className="font-medium mb-2 text-sm">
                  Filter by period:
                </div>
                <div className="space-y-1">
                  <div
                    className={`cursor-pointer p-1 rounded text-sm ${
                      selectedPeriod === null
                        ? "bg-blue-100 text-blue-800"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => selectPeriod(null)}
                  >
                    All periods
                  </div>
                  {periods.map((period) => (
                    <div
                      key={period}
                      className={`cursor-pointer p-1 rounded text-sm ${
                        selectedPeriod === period
                          ? "bg-blue-100 text-blue-800"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => selectPeriod(period)}
                    >
                      {formatPeriodDate(period)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-grow overflow-y-auto">
              {selectedPeriod === null ? (
                // Show periods with their expandable sections
                <div className="space-y-2">
                  {periods.map((period) => (
                    <div key={period} className="border rounded overflow-hidden">
                      <div
                        className="flex items-center justify-between p-2 bg-blue-50 cursor-pointer"
                        onClick={() => togglePeriod(period)}
                      >
                        <span className="font-semibold text-blue-700">
                          {formatPeriodDate(period)}
                        </span>
                        {expandedPeriods[period] ? (
                          <ChevronDown size={16} className="text-blue-700" />
                        ) : (
                          <ChevronRight size={16} className="text-blue-700" />
                        )}
                      </div>
                      {expandedPeriods[period] && (
                        <div className="border-t">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500">
                                  Data type
                                </th>
                                <th className="px-3 py-1.5 text-right text-xs font-medium text-gray-500">
                                  Records
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {getDataRecords(period).map((item, index) => (
                                <tr key={`${period}-${item.type}-${index}`} className="hover:bg-gray-50">
                                  <td className="px-3 py-1.5 text-sm text-gray-700">
                                    {item.type}
                                  </td>
                                  <td className="px-3 py-1.5 text-sm text-gray-700 text-right">
                                    {item.records}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // Show filtered data for selected period
                <div className="border rounded overflow-hidden">
                  <div className="bg-blue-50 p-2">
                    <span className="font-semibold text-blue-700">
                      {formatPeriodDate(selectedPeriod)}
                    </span>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500">
                          Data type
                        </th>
                        <th className="px-3 py-1.5 text-right text-xs font-medium text-gray-500">
                          Records
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getDataRecords(selectedPeriod).map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-1.5 text-sm text-gray-700">
                            {item.type}
                          </td>
                          <td className="px-3 py-1.5 text-sm text-gray-700 text-right">
                            {item.records}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsLeftPanel;
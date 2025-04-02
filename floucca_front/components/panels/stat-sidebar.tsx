"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown, Filter } from "lucide-react";

interface DataRecord {
  type: string;
  records: string | number;
  period: string;
}

const reportData: DataRecord[] = [
  { type: "Ports", records: 12, period: "2024 01 B" },
  { type: "Coops", records: 30, period: "2024 01 B" },
  { type: "Region", records: 30, period: "2024 01 B" },
  { type: "Boats and gears", records: 12, period: "2024 01 B" },
  { type: "Species", records: 121, period: "2024 01 B" },
  { type: "Weight and Value Units", records: "Kg , LBP", period: "2024 01 B" },
  { type: "Boat Details", records: 1, period: "2024 01 B" },
  { type: "Effort Today", records: 4, period: "2024 01 B" },
  { type: "Estimates", records: 5, period: "2024 01 B" },
  { type: "Ports", records: 12, period: "2023 12 B" },
  { type: "Coops", records: 28, period: "2023 12 B" },
  { type: "Region", records: 30, period: "2023 12 B" },
  { type: "Species", records: 118, period: "2023 12 B" },
];

// Get unique periods
const periods = Array.from(new Set(reportData.map((item) => item.period)));

const ReportsLeftPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedPeriods, setExpandedPeriods] = useState<
    Record<string, boolean>
  >(Object.fromEntries(periods.map((period) => [period, true])));
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [showPeriodFilter, setShowPeriodFilter] = useState(false);

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

  const filteredData = selectedPeriod
    ? reportData.filter((item) => item.period === selectedPeriod)
    : reportData;

  const getFilteredDataByPeriod = (period: string) => {
    return reportData.filter((item) => item.period === period);
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 h-full overflow-y-auto transition-all duration-300 ${
        isExpanded ? "w-64" : "w-24"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-2">
        {isExpanded ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Summaries</h2>
              <button
                onClick={togglePeriodFilter}
                className="p-1 rounded hover:bg-gray-100"
                title="Filter by period"
              >
                <Filter size={18} />
              </button>
            </div>

            {showPeriodFilter && (
              <div className="mb-4 p-2 bg-gray-50 rounded border">
                <div className="font-medium mb-2 text-sm">
                  Filter by period:
                </div>
                <div className="space-y-1">
                  <div
                    className={`cursor-pointer p-1 rounded text-sm ${
                      selectedPeriod === null
                        ? "bg-indigo-100 text-indigo-800"
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
                          ? "bg-indigo-100 text-indigo-800"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => selectPeriod(period)}
                    >
                      {period}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedPeriod === null ? (
              // Show periods with their expandable sections
              <div className="space-y-2">
                {periods.map((period) => (
                  <div key={period} className="border rounded overflow-hidden">
                    <div
                      className="flex items-center justify-between p-2 bg-indigo-50 cursor-pointer"
                      onClick={() => togglePeriod(period)}
                    >
                      <span className="font-semibold text-indigo-700">
                        {period}
                      </span>
                      {expandedPeriods[period] ? (
                        <ChevronDown size={16} className="text-indigo-700" />
                      ) : (
                        <ChevronRight size={16} className="text-indigo-700" />
                      )}
                    </div>
                    {expandedPeriods[period] && (
                      <div className="border-t">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                Data type
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                Records
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {getFilteredDataByPeriod(period).map(
                              (item, index) => (
                                <tr key={`${period}-${item.type}-${index}`}>
                                  <td className="px-3 py-2 text-sm text-gray-700">
                                    {item.type}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-700">
                                    {item.records}
                                  </td>
                                </tr>
                              )
                            )}
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
                <div className="bg-indigo-50 p-2">
                  <span className="font-semibold text-indigo-700">
                    {selectedPeriod}
                  </span>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                        Data type
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                        Records
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 text-sm text-gray-700">
                          {item.type}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-700">
                          {item.records}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-center py-3 border-b w-full mb-4">
              <span className="font-bold text-indigo-700 text-sm">
                Statistics
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsLeftPanel;

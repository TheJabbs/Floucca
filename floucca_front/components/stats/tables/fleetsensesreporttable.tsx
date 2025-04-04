import React, { useState, useEffect } from "react";
import { useStatsData } from "@/contexts/StatsDataContext";
import { getFleetSensesReport } from "@/services/fleetSensesService";
import { RefreshCw } from "lucide-react";

const FleetSensesReportTable: React.FC = () => {
  const { ports, formattedPeriods } = useStatsData();
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedPorts, setSelectedPorts] = useState<number[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const handlePortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
    setSelectedPorts(selected);
  };

  const fetchReportData = async () => {
    if (!selectedYear || selectedPorts.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const filter = { period: selectedYear, port_id: selectedPorts };
      const data = await getFleetSensesReport(filter);
      setReportData(data);
    } catch (err) {
      console.error("Error fetching fleet senses report:", err);
      setError("Failed to fetch report data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedYear && selectedPorts.length > 0) {
      fetchReportData();
    }
  }, [selectedYear, selectedPorts]);

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!reportData || reportData.length === 0) {
      return (
        <div className="text-center text-gray-500 py-6">
          No data available for the selected filters.
        </div>
      );
    }

    return (
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Month</th>
            <th className="px-4 py-2 text-left">Gear Code</th>
            <th className="px-4 py-2 text-left">Gear Name</th>
            <th className="px-4 py-2 text-left">Frequency</th>
            <th className="px-4 py-2 text-left">Active Days</th>
            <th className="px-4 py-2 text-left">Total Fishing Hours</th>
            <th className="px-4 py-2 text-left">Catch (Fish Count)</th>
            <th className="px-4 py-2 text-left">Effort per Day</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item) => {
            const effortPerDay = item.totalFishingHours / item.activeDays || 0;

            return (
              <tr key={`${item.gear_code}-${item.month}`}>
                <td className="px-4 py-2">{item.month}</td>
                <td className="px-4 py-2">{item.gear_code}</td>
                <td className="px-4 py-2">{item.gear_name}</td> {/* Displaying the gear name */}
                <td className="px-4 py-2">{item.freq}</td>
                <td className="px-4 py-2">{item.activeDays}</td>
                <td className="px-4 py-2">{item.totalFishingHours}</td>
                <td className="px-4 py-2">{item.totalFishCaught}</td>
                <td className="px-4 py-2">{effortPerDay.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fleet Senses Report</h1>
        <button
          onClick={fetchReportData}
          disabled={!selectedYear || selectedPorts.length === 0}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm ${selectedYear && selectedPorts.length > 0 ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            id="year"
            value={selectedYear}
            onChange={handleYearChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Select a year</option>
            {formattedPeriods.map((period) => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ports" className="block text-sm font-medium text-gray-700 mb-1">Ports</label>
          <select
            id="ports"
            multiple
            value={selectedPorts.map(String)}
            onChange={handlePortChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {ports.map((port) => (
              <option key={port.port_id} value={port.port_id}>{port.port_name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg border shadow-sm overflow-x-auto">
        {renderTable()}
      </div>
    </div>
  );
};

export default FleetSensesReportTable;

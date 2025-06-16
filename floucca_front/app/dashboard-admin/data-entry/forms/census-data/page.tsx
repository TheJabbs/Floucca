"use client";

import React, { useState, useEffect } from "react";
import { useFormsData } from "@/contexts/FormDataContext";
import { usePort } from "@/contexts/PortContext";
import { usePeriod } from "@/contexts/PeriodContext";
import PortDropdown from "@/components/forms-c/port-dropdown";
import PeriodDropdown from "@/components/forms-c/period-dropdown";
import ReusableDataTable from "@/components/admin/table";
import { fetchFleetReport } from "@/services/fleetReportService";
import { getGears, Gear } from "@/services/gearService";

interface FleetReportData {
  gear_code: number;
  gear_name: string;
  month: number;
  freq: number;
  activeDays: number;
}

const CensusDataPage: React.FC = () => {
  const { selectedPort } = usePort();
  const { selectedPeriod } = usePeriod();
  const { ports, periods, isLoading: isDataLoading, error: dataError } = useFormsData();
  
  const [reportData, setReportData] = useState<FleetReportData[]>([]);
  const [allGears, setAllGears] = useState<Gear[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all gears
  useEffect(() => {
    const fetchAllGears = async () => {
      try {
        const gears = await getGears();
        setAllGears(gears);
      } catch (err) {
        console.error('Error fetching gears:', err);
      }
    };

    fetchAllGears();
  }, []);

  // Fetch fleet report data when port or period changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPort || !selectedPeriod) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const filter = {
          port_id: [selectedPort],
          period: selectedPeriod
        };

        const data = await fetchFleetReport(filter);
        console.log('Fleet report data:', data);
        setReportData(data);
      } catch (err) {
        setError('Failed to fetch fleet report data');
        console.error('Error fetching fleet report:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPort, selectedPeriod]);

  // Combine gear data with report data
  const combinedData = allGears.map(gear => {
    const reportEntry = reportData.find(r => r.gear_code === gear.gear_code);
    return {
      gear_code: gear.gear_code,
      gear_name: gear.gear_name,
      equipment_id: gear.equipment_id,
      equipment_name: gear.equipment_name,
      month: reportEntry?.month || 0,
      freq: reportEntry?.freq || 0,
      activeDays: reportEntry?.activeDays || 0,
    };
  });

  const columns = [
    { key: "gear_code", header: "Gear Code" },
    { key: "gear_name", header: "Gear Name" },
    { key: "equipment_name", header: "Equipment" },
    { key: "month", header: "Month" },
    { key: "freq", header: "Frequency" },
    { key: "activeDays", header: "Active Days" },
  ];

  if (isDataLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p>{dataError}</p>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fleet Census Data</h1>
        <div className="flex gap-4">
          <div className="w-72">
            <PortDropdown ports={ports} />
          </div>
          <div className="w-72">
            <PeriodDropdown periods={periods} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Fleet Report</h2>
          <p className="text-sm text-gray-500">
            View fleet census data for the selected port and period
          </p>
        </div>

        <ReusableDataTable
          data={combinedData}
          columns={columns}
          keyExtractor={(item) => `${item.gear_code}-${item.month}`}
          isLoading={isLoading}
          error={error}
          noDataMessage="No data found for the selected filters. Please adjust your filter criteria or apply them."
        />
      </div>
    </div>
  );
};

export default CensusDataPage; 
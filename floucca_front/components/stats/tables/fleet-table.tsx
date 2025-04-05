import React, { useMemo } from "react";
import ReusableTable from "@/components/utils/table";

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

interface FleetUsageTableProps {
  data: FormattedGearData[];
  isLoading: boolean;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const FleetUsageTable: React.FC<FleetUsageTableProps> = ({
  data,
  isLoading,
  activeTab,
  setActiveTab
}) => {
  // Format data for the currently selected view (frequency or active days)
  const formatDataForView = (data: FormattedGearData[]): any[] => {
    return data.map(gear => {
      const uniqueKey = `${gear.gear_code}-${gear.gear_name.replace(/\s+/g, '-')}`;
      
      const result: any = {
        key: uniqueKey,
        gear_code: gear.gear_code,
        gear_name: gear.gear_name,
      };
      
      // Add data for each month
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      months.forEach(month => {
        if (gear[month as keyof FormattedGearData]) {
          const monthData = gear[month as keyof FormattedGearData] as { freq: number; activeDays: number };
          result[month] = activeTab === 'frequency' ? monthData.freq : monthData.activeDays;
        } else {
          result[month] = '0';
        }
      });
      
      return result;
    });
  };
  
  // Get the formatted data based on the active tab
  const displayData = useMemo(() => {
    return formatDataForView(data);
  }, [data, activeTab]);

  const columns = useMemo(() => [
    { key: "gear_name", header: "GEAR" },
    { key: "jan", header: "JAN" },
    { key: "feb", header: "FEB" },
    { key: "mar", header: "MAR" },
    { key: "apr", header: "APR" },
    { key: "may", header: "MAY" },
    { key: "jun", header: "JUN" },
    { key: "jul", header: "JUL" },
    { key: "aug", header: "AUG" },
    { key: "sep", header: "SEP" },
    { key: "oct", header: "OCT" },
    { key: "nov", header: "NOV" },
    { key: "dec", header: "DEC" },
  ], []);

  if (data.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
        <h2 className="text-lg font-semibold p-4 border-b">Fleet Gear Usage</h2>
        <div className="p-8 text-center text-gray-500">
          No gear usage data available. Please select filters and generate the report.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Fleet Gear Usage</h2>
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setActiveTab('frequency')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'frequency'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Frequency
            </button>
            <button
              onClick={() => setActiveTab('activeDays')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'activeDays'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Active Days
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {activeTab === 'frequency'
            ? 'Showing frequency of gear usage per month'
            : 'Showing active days of gear usage per month'}
        </p>
      </div>
      
      <ReusableTable
        columns={columns}
        data={displayData}
        isLoading={isLoading}
        noDataMessage="No gear usage data available. Please select filters and generate the report."
        keyExtractor={(item) => item.key}
      />
    </div>
  );
};

export default FleetUsageTable;
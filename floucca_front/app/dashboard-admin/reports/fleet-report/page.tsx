"use client";
import React, { useState, useCallback } from "react";
import { RefreshCw, FileDown } from "lucide-react";
import { useStatsData } from "@/contexts/StatsDataContext";
import { fetchFleetReport, FleetReportData } from "@/services/fleetReportService";
import FleetUsageTable from "@/components/stats/tables/fleet-table";
import * as XLSX from 'xlsx';

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
  const [isExporting, setIsExporting] = useState(false);
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

  // Export data to Excel
  const exportToExcel = useCallback(() => {
    if (!reportData.length || isExporting || isReportLoading) {
      return;
    }

    setIsExporting(true);

    try {
      // Get filter information for the report
      const filterInfo = filterType === 'port' 
        ? `Ports: ${selectedPorts.map(p => ports.find(port => port.port_id === p)?.port_name).join(', ')}`
        : filterType === 'region'
          ? `Regions: ${selectedRegions.map(r => regions.find(region => region.region_code === r)?.region_name).join(', ')}`
          : `Cooperatives: ${selectedCoops.map(c => coops.find(coop => coop.coop_code === c)?.coop_name).join(', ')}`;

      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Prepare the data for export
      // We'll only export data for the active tab (frequency or active days)
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const headerRow = ['Gear Name', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Create report data based on active tab
      const reportRows: (string | number)[][] = reportData.map(gear => {
        const row: (string | number)[] = [
          gear.gear_name
        ];
        
        // Add data for each month
        monthNames.forEach(month => {
          const monthData = gear[month as keyof FormattedGearData] as { freq: number; activeDays: number } | undefined;
          if (activeTab === 'frequency') {
            row.push(monthData?.freq ?? 0);
          } else { // activeDays
            row.push(monthData?.activeDays ?? 0);
          }
        });
        
        return row;
      });
      
      // Prepare data for the worksheet
      const excelData = [
        // Report header
        [`FLOUCA Fleet ${activeTab === 'frequency' ? 'Frequency' : 'Active Days'} Report - ${selectedYear}`],
        ['Generated on', new Date().toLocaleString()],
        [''],
        ['Filter', filterInfo],
        ['Year', selectedYear],
        ['Type', activeTab === 'frequency' ? 'Monthly Gear Frequency' : 'Monthly Active Days'],
        [''],
        headerRow,
        ...reportRows
      ];
      
      // Create the worksheet
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      
      // Apply styling to the sheet
      // Style for the main title
      ws['A1'].s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: 'center' }
      };
      
      // Merge cells for the title
      if (!ws['!merges']) ws['!merges'] = [];
      ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 13 } }); // Merge A1:N1
      
      // Style filter information as bold
      for (let i = 3; i <= 5; i++) {
        ws[`A${i+1}`].s = { font: { bold: true } };
      }
      
      // Style the table header
      for (let i = 0; i < headerRow.length; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: 7, c: i });
        ws[cellRef].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "E6F2FF" } }, // Light blue background
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          }
        };
      }
      
      // Style data rows
      for (let r = 8; r < 8 + reportRows.length; r++) {
        for (let c = 0; c < headerRow.length; c++) {
          const cellRef = XLSX.utils.encode_cell({ r, c });
          if (ws[cellRef]) {
            ws[cellRef].s = {
              border: {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
              }
            };
            
            // Format numeric cells
            if (c >= 1) { // Skip gear code and name columns
              ws[cellRef].z = '#,##0'; // Number format without decimal places for frequencies
            }
          }
        }
      }
      
      // Set column widths
      ws['!cols'] = [
        { width: 20 }, // Gear name
        { width: 8 }, // Jan
        { width: 8 }, // Feb
        { width: 8 }, // Mar
        { width: 8 }, // Apr
        { width: 8 }, // May
        { width: 8 }, // Jun
        { width: 8 }, // Jul
        { width: 8 }, // Aug
        { width: 8 }, // Sep
        { width: 8 }, // Oct
        { width: 8 }, // Nov
        { width: 8 }  // Dec
      ];
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, `Fleet ${activeTab === 'frequency' ? 'Frequency' : 'Active Days'}`);
      
      // Generate filename
      const filterText = filterType === 'port' 
        ? `Ports_${selectedPorts.length}`
        : filterType === 'region'
          ? `Regions_${selectedRegions.length}`
          : `Coops_${selectedCoops.length}`;
      
      const fileName = `FLOUCA_Fleet_${activeTab}_${selectedYear}_${filterText}.xlsx`;
      
      // Trigger download
      XLSX.writeFile(wb, fileName);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [
    activeTab,
    reportData,
    isExporting,
    isReportLoading,
    selectedYear,
    filterType,
    selectedPorts,
    selectedRegions,
    selectedCoops,
    ports,
    regions,
    coops
  ]);

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
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            disabled={!areFiltersSelected()}
            className="px-3 py-2 rounded-lg flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </button>
          
          <button
            onClick={exportToExcel}
            disabled={!reportData.length || isExporting || isReportLoading}
            className={`px-3 py-2 rounded-lg flex items-center gap-1 text-sm ${
              reportData.length && !isExporting && !isReportLoading
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FileDown className="h-4 w-4" />
            <span>{isExporting ? "Exporting..." : "Export Excel"}</span>
          </button>
        </div>
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
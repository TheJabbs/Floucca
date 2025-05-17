"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller} from "react-hook-form";
import { useStatsData } from "@/contexts/StatsDataContext";
import {
  RefreshCw,
  FileDown,
  Columns,
  Plus,
  Trash,
  Filter,
  TrendingUp,
  TrendingDown,
  Percent,
} from "lucide-react";
import { fetchStatisticsData, StatsFilter } from "@/services/statsService";
import EffortTable from "@/components/stats/tables/effort-table";
import LandingsTable from "@/components/stats/tables/landings-table";
import SpeciesTable from "@/components/stats/tables/species-table";

// Types for filter form
interface FilterFormValues {
  period: string;
  gearCodes: number[];
  filterType: "port" | "region" | "coop";
  portIds?: number[];
  regionIds?: number[];
  coopIds?: number[];
  speciesFilter?: string;
}

// Types for report data
interface EffortData {
  records: number;
  gears: number;
  activeDays: number;
  pba: number;
  estEffort: number;
}

interface LandingsData {
  records: number;
  avgPrice: number;
  estValue: number;
  cpue: number;
  estCatch: number;
  sampleCatch: number;
}

interface SpeciesData {
  specie_name: string;
  numbOfCatch: number;
  avgPrice: number;
  avgWeight: number;
  avgLength: number;
  avgQuantity: number;
  value: number;
  cpue: number;
  estCatch: number;
  effort: number;
}

interface ReportData {
  upperTables: {
    effort: EffortData;
    landings: LandingsData;
  };
  lowerTable: SpeciesData[];
  filterParams: FilterFormValues;
  timestamp: string;
}

// Tab component for multiple reports
const ReportTab = ({
  label,
  isActive,
  onClick,
  onClose,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
}) => (
  <div
    className={`relative group flex items-center px-4 py-2 border-b-2 cursor-pointer ${
      isActive
        ? "border-blue-600 text-blue-700 font-medium"
        : "border-transparent hover:border-gray-300"
    }`}
  >
    <div onClick={onClick}>{label}</div>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
    >
      <Trash className="h-4 w-4" />
    </button>
  </div>
);

// Main component
const AdvancedReportPage: React.FC = () => {
  // State for reports
  const [reports, setReports] = useState<ReportData[]>([]);
  const [activeReportIndex, setActiveReportIndex] = useState<number>(0);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [compareIndex, setCompareIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredSpecies, setFilteredSpecies] = useState<SpeciesData[]>([]);

  // Get reference data from context
  const {
    gears,
    ports,
    regions,
    coops,
    formattedPeriods,
    isLoading: isDataLoading,
    error: dataError,
  } = useStatsData();

  // Set up form
  const { control, handleSubmit, watch, reset } = useForm<FilterFormValues>({
    defaultValues: {
      period: "",
      gearCodes: [],
      filterType: "port",
      portIds: [],
    },
  });

  const filterType = watch("filterType");
  const speciesFilter = watch("speciesFilter");

  // Add new report tab
  const addNewReport = useCallback(() => {
    // generate new tab with default values
    const newReport: ReportData = {
      upperTables: {
        effort: {
          records: 0,
          gears: 0,
          activeDays: 0,
          pba: 0,
          estEffort: 0,
        },
        landings: {
          records: 0,
          avgPrice: 0,
          estValue: 0,
          cpue: 0,
          estCatch: 0,
          sampleCatch: 0,
        },
      },
      lowerTable: [],
      filterParams: {
        period: "",
        gearCodes: [],
        filterType: "port",
        portIds: [],
      },
      timestamp: new Date().toISOString(),
    };

    setReports([...reports, newReport]);
    setActiveReportIndex(reports.length);
  }, [reports]);

  // initialize with one empty report
  useEffect(() => {
    if (reports.length === 0) {
      addNewReport();
    }
  }, [reports.length, addNewReport]);

  // filter species based on search term
  useEffect(() => {
    if (!reports[activeReportIndex]?.lowerTable) return;

    if (!speciesFilter) {
      setFilteredSpecies(reports[activeReportIndex].lowerTable);
      return;
    }

    const filtered = reports[activeReportIndex].lowerTable.filter((species) =>
      species.specie_name.toLowerCase().includes(speciesFilter.toLowerCase())
    );

    setFilteredSpecies(filtered);
  }, [speciesFilter, reports, activeReportIndex]);

  // generate API filter object from form values
  const generateApiFilter = (formValues: FilterFormValues): StatsFilter => {
    const filter: StatsFilter = {
      period: formValues.period,
      gear_code:
        formValues.gearCodes.length > 0 ? formValues.gearCodes : undefined,
    };

    // add the appropriate location filter based on selected filter type
    if (
      formValues.filterType === "port" &&
      formValues.portIds &&
      formValues.portIds.length > 0
    ) {
      filter.port_id = formValues.portIds;
    } else if (
      formValues.filterType === "region" &&
      formValues.regionIds &&
      formValues.regionIds.length > 0
    ) {
      filter.region = formValues.regionIds;
    } else if (
      formValues.filterType === "coop" &&
      formValues.coopIds &&
      formValues.coopIds.length > 0
    ) {
      filter.coop = formValues.coopIds;
    }
    return filter;
  };

  // Generate the report
  const generateReport = async (data: FilterFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const apiFilter = generateApiFilter(data);
      console.log("Generating report with filter:", apiFilter);

      const result = await fetchStatisticsData(apiFilter);

      const updatedReports = [...reports];
      updatedReports[activeReportIndex] = {
        upperTables: {
          effort: result.upperTables.effort,
          landings: {
            ...result.upperTables.landings,
          },
        },
        lowerTable: result.lowerTable,
        filterParams: data,
        timestamp: new Date().toISOString(),
      };

      setReports(updatedReports);
      setFilteredSpecies(result.lowerTable);
    } catch (err) {
      console.error("Error generating report:", err);
      setError(
        typeof err === "string"
          ? err
          : "Failed to generate report. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // handle report tab clicks
  const handleTabClick = (index: number) => {
    setActiveReportIndex(index);
    const report = reports[index];

    if (report && report.filterParams) {
      reset(report.filterParams);
    }
  };

  // close a report tab
  const closeReport = (index: number) => {
    const newReports = reports.filter((_, i) => i !== index);

    // if closing the active report adjust index
    if (index === activeReportIndex) {
      setActiveReportIndex(Math.max(0, index - 1));
    } else if (index < activeReportIndex) {
      // if closing a report before the active one adjust the index
      setActiveReportIndex(activeReportIndex - 1);
    }

    // if closing one of the comparison reports exit compare mode
    if (
      isComparing &&
      (index === activeReportIndex || index === compareIndex)
    ) {
      setIsComparing(false);
      setCompareIndex(null);
    }

    setReports(newReports);

    // if no reports add a new empty one
    if (newReports.length === 0) {
      addNewReport();
    }
  };

  // toggle comparison mode
  const toggleCompare = (index: number) => {
    if (isComparing && compareIndex === index) {
      // turn off
      setIsComparing(false);
      setCompareIndex(null);
    } else {
      // turn on
      setIsComparing(true);
      setCompareIndex(index);
    }
  };

  // calc differences between reports for comparison
  const calculateDifference = (
    current: number,
    comparison: number
  ): { value: number; percent: number; isIncrease: boolean } => {
    if (!current || !comparison)
      return { value: 0, percent: 0, isIncrease: false };

    const diff = current - comparison;
    const percentChange = comparison !== 0 ? (diff / comparison) * 100 : 0;

    return {
      value: Math.abs(diff),
      percent: Math.abs(percentChange),
      isIncrease: diff > 0,
    };
  };

  // Show loading state
  if (isDataLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Advanced Statistical Reports
      </h1>

      {/* Filter Form */}
      <form
        onSubmit={handleSubmit(generateReport)}
        className="bg-white p-6 rounded-lg border mb-6 shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Time Period */}
            <div>
              <div className="space-y-3">
                <Controller
                  name="period"
                  control={control}
                  rules={{ required: "Time period is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Period <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...field}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          error ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select a period</option>
                        {formattedPeriods
                          .sort((a, b) => b.value.localeCompare(a.value))
                          .map((period) => (
                            <option key={period.value} value={period.value}>
                              {period.label}
                            </option>
                          ))}
                      </select>
                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Gear Selection */}
            <div>
              <div className="space-y-3">
                <Controller
                  name="gearCodes"
                  control={control}
                  rules={{ required: "At least one gear is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Gears <span className="text-red-500">*</span>
                      </label>
                      <div className="border rounded-lg p-2 max-h-44 overflow-y-auto bg-white">
                        {gears.map((gear) => (
                          <label
                            key={gear.gear_code}
                            className="flex items-center py-1 px-2 hover:bg-gray-50 rounded"
                          >
                            <input
                              type="checkbox"
                              value={gear.gear_code}
                              checked={field.value.includes(gear.gear_code)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const value = Number(e.target.value);
                                field.onChange(
                                  checked
                                    ? [...field.value, value]
                                    : field.value.filter((v) => v !== value)
                                );
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">{gear.gear_name}</span>
                          </label>
                        ))}
                      </div>
                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/*Location Filters */}
          <div>
            <div className="space-y-3">
              <Controller
                name="filterType"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filter By
                    </label>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => field.onChange("port")}
                        className={`flex-1 py-1.5 px-3 rounded-md text-sm ${
                          field.value === "port"
                            ? "bg-blue-600 text-white"
                            : "text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        Port
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("region")}
                        className={`flex-1 py-1.5 px-3 rounded-md text-sm ${
                          field.value === "region"
                            ? "bg-blue-600 text-white"
                            : "text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        Region
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("coop")}
                        className={`flex-1 py-1.5 px-3 rounded-md text-sm ${
                          field.value === "coop"
                            ? "bg-blue-600 text-white"
                            : "text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        Cooperative
                      </button>
                    </div>
                  </div>
                )}
              />

              {/* Port Selection */}
              {filterType === "port" && (
                <Controller
                  name="portIds"
                  control={control}
                  rules={{ required: "At least one port is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Ports <span className="text-red-500">*</span>
                      </label>
                      <div className="border rounded-lg p-2 max-h-44 overflow-y-auto bg-white">
                        {ports.map((port) => (
                          <label
                            key={port.port_id}
                            className="flex items-center py-1 px-2 hover:bg-gray-50 rounded"
                          >
                            <input
                              type="checkbox"
                              value={port.port_id}
                              checked={field.value?.includes(port.port_id)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const value = Number(e.target.value);
                                field.onChange(
                                  checked
                                    ? [...(field.value || []), value]
                                    : (field.value || []).filter(
                                        (v) => v !== value
                                      )
                                );
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">{port.port_name}</span>
                          </label>
                        ))}
                      </div>
                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              )}

              {/* Region Selection */}
              {filterType === "region" && (
                <Controller
                  name="regionIds"
                  control={control}
                  rules={{ required: "At least one region is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Regions <span className="text-red-500">*</span>
                      </label>
                      <div className="border rounded-lg p-2 max-h-44 overflow-y-auto bg-white">
                        {regions.map((region) => (
                          <label
                            key={region.region_code}
                            className="flex items-center py-1 px-2 hover:bg-gray-50 rounded"
                          >
                            <input
                              type="checkbox"
                              value={region.region_code}
                              checked={field.value?.includes(
                                region.region_code
                              )}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const value = Number(e.target.value);
                                field.onChange(
                                  checked
                                    ? [...(field.value || []), value]
                                    : (field.value || []).filter(
                                        (v) => v !== value
                                      )
                                );
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">
                              {region.region_name}
                            </span>
                          </label>
                        ))}
                      </div>
                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              )}

              {/* Cooperative Selection */}
              {filterType === "coop" && (
                <Controller
                  name="coopIds"
                  control={control}
                  rules={{ required: "At least one cooperative is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Cooperatives{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="border rounded-lg p-2 max-h-44 overflow-y-auto bg-white">
                        {coops.map((coop) => (
                          <label
                            key={coop.coop_code}
                            className="flex items-center py-1 px-2 hover:bg-gray-50 rounded"
                          >
                            <input
                              type="checkbox"
                              value={coop.coop_code}
                              checked={field.value?.includes(coop.coop_code)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const value = Number(e.target.value);
                                field.onChange(
                                  checked
                                    ? [...(field.value || []), value]
                                    : (field.value || []).filter(
                                        (v) => v !== value
                                      )
                                );
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">{coop.coop_name}</span>
                          </label>
                        ))}
                      </div>
                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Reset Filters
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Report Content */}
      <div className="space-y-6">
        {/* Report Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">
              {reports[activeReportIndex]?.filterParams?.period
                ? `Report for ${new Date(
                    reports[activeReportIndex].filterParams.period
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}`
                : "New Report"}
            </h2>
            {reports[activeReportIndex]?.timestamp && (
              <span className="text-sm text-gray-500">
                Generated{" "}
                {new Date(
                  reports[activeReportIndex].timestamp
                ).toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            {reports.length > 1 && (
              <button
                onClick={() => setIsComparing(!isComparing)}
                className={`px-3 py-1.5 flex items-center rounded-lg text-sm ${
                  isComparing
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Columns className="h-4 w-4 mr-1.5" />
                {isComparing ? "Exit Comparison" : "Compare Reports"}
              </button>
            )}
          </div>
        </div>

        {/* Report Comparison Mode */}
        {isComparing && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <h3 className="font-medium text-blue-800 mb-3">Compare with:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {reports.map(
                (report, index) =>
                  index !== activeReportIndex && (
                    <button
                      key={`compare-${index}`}
                      onClick={() => toggleCompare(index)}
                      className={`p-2 text-sm rounded-lg text-center ${
                        compareIndex === index
                          ? "bg-blue-600 text-white"
                          : "bg-white border hover:bg-gray-50"
                      }`}
                    >
                      Report {index + 1}
                    </button>
                  )
              )}
            </div>
          </div>
        )}

        {/* Comparison Data Display */}
        {isComparing && compareIndex !== null && (
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Comparison Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Effort Comparison */}
              <div className="border rounded-lg p-4">
                <h4 className="text-md font-medium mb-3 text-gray-700">
                  Effort Metrics Comparison
                </h4>
                <div className="space-y-3">
                  {Object.entries(
                    reports[activeReportIndex]?.upperTables?.effort || {}
                  ).map(([key, value]) => {
                    const comparison =
                      reports[compareIndex]?.upperTables?.effort?.[
                        key as keyof EffortData
                      ];
                    if (comparison === undefined) return null;

                    const diff = calculateDifference(
                      value as number,
                      comparison as number
                    );

                    return (
                      <div
                        key={key}
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                      >
                        <span className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{value}</span>
                          <div className="ml-2 flex items-center">
                            {diff.isIncrease ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span
                              className={`text-xs ml-1 ${
                                diff.isIncrease
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {diff.value.toFixed(2)} ({diff.percent.toFixed(1)}
                              %)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Landings Comparison */}
              <div className="border rounded-lg p-4">
                <h4 className="text-md font-medium mb-3 text-gray-700">
                  Landings Metrics Comparison
                </h4>
                <div className="space-y-3">
                  {Object.entries(
                    reports[activeReportIndex]?.upperTables?.landings || {}
                  ).map(([key, value]) => {
                    const comparison =
                      reports[compareIndex]?.upperTables?.landings?.[
                        key as keyof LandingsData
                      ];
                    if (comparison === undefined) return null;

                    const diff = calculateDifference(
                      value as number,
                      comparison as number
                    );

                    return (
                      <div
                        key={key}
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                      >
                        <span className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{value}</span>
                          <div className="ml-2 flex items-center">
                            {diff.isIncrease ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span
                              className={`text-xs ml-1 ${
                                diff.isIncrease
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {diff.value.toFixed(2)} ({diff.percent.toFixed(1)}
                              %)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Report Tabs */}
        <div className="flex border-b overflow-x-auto mb-4">
          {reports.map((report, index) => (
            <ReportTab
              key={`report-${index}`}
              label={`Report ${index + 1}`}
              isActive={activeReportIndex === index}
              onClick={() => handleTabClick(index)}
              onClose={() => closeReport(index)}
            />
          ))}
          <button
            onClick={addNewReport}
            className="px-3 py-1 ml-2 flex items-center text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Plus className="h-4 w-4 mr-1" /> New Report
          </button>
        </div>
        {/* Species Filter */}
        {reports[activeReportIndex]?.lowerTable?.length > 0 && (
          <div className="mb-4 relative">
            <div className="flex items-center border-b pb-2">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <label
                htmlFor="speciesFilter"
                className="block text-sm font-medium text-gray-700 mr-2"
              >
                Filter Species:
              </label>
              <Controller
                name="speciesFilter"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="speciesFilter"
                    type="text"
                    placeholder="Enter species name..."
                    className="flex-grow px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* Report Data Tables */}
        {reports[activeReportIndex]?.upperTables && (
          <div className="bg-white border shadow-sm rounded-lg p-6 space-y-6">
            {/* Effort and Landings Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EffortTable
                isLoading={isLoading}
                effortData={reports[activeReportIndex].upperTables.effort}
              />
              <LandingsTable
                isLoading={isLoading}
                landingsData={reports[activeReportIndex].upperTables.landings}
              />
            </div>

            {/* Species Table */}
            <div className="border-t pt-6">
              {/* Species Comparison Table */}
              {isComparing && compareIndex !== null ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Species
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Catch Count
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg Price
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg Weight
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CPUE
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Est. Catch
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSpecies.map((species, index) => {
                        // Find matching species in comparison report
                        const comparisonSpecies = reports[
                          compareIndex!
                        ].lowerTable.find(
                          (s) => s.specie_name === species.specie_name
                        );

                        return (
                          <tr
                            key={`species-${index}`}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {species.specie_name}
                            </td>

                            {/* Number of Catch */}
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center justify-center">
                                <span className="font-medium">
                                  {species.numbOfCatch.toFixed(1)}
                                </span>
                                {comparisonSpecies && (
                                  <div className="ml-2 flex items-center">
                                    {species.numbOfCatch >
                                    comparisonSpecies.numbOfCatch ? (
                                      <TrendingUp className="h-4 w-4 text-green-600" />
                                    ) : species.numbOfCatch <
                                      comparisonSpecies.numbOfCatch ? (
                                      <TrendingDown className="h-4 w-4 text-red-600" />
                                    ) : (
                                      <Percent className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Average Price */}
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center justify-center">
                                <span className="font-medium">
                                  {species.avgPrice.toFixed(0)}
                                </span>
                                {comparisonSpecies && (
                                  <div className="ml-2 flex items-center">
                                    {species.avgPrice >
                                    comparisonSpecies.avgPrice ? (
                                      <TrendingUp className="h-4 w-4 text-green-600" />
                                    ) : species.avgPrice <
                                      comparisonSpecies.avgPrice ? (
                                      <TrendingDown className="h-4 w-4 text-red-600" />
                                    ) : (
                                      <Percent className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Average Weight */}
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center justify-center">
                                <span className="font-medium">
                                  {species.avgWeight.toFixed(2)}
                                </span>
                                {comparisonSpecies && (
                                  <div className="ml-2 flex items-center">
                                    {species.avgWeight >
                                    comparisonSpecies.avgWeight ? (
                                      <TrendingUp className="h-4 w-4 text-green-600" />
                                    ) : species.avgWeight <
                                      comparisonSpecies.avgWeight ? (
                                      <TrendingDown className="h-4 w-4 text-red-600" />
                                    ) : (
                                      <Percent className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* CPUE */}
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center justify-center">
                                <span className="font-medium">
                                  {species.cpue.toFixed(2)}
                                </span>
                                {comparisonSpecies && (
                                  <div className="ml-2 flex items-center">
                                    {species.cpue > comparisonSpecies.cpue ? (
                                      <TrendingUp className="h-4 w-4 text-green-600" />
                                    ) : species.cpue <
                                      comparisonSpecies.cpue ? (
                                      <TrendingDown className="h-4 w-4 text-red-600" />
                                    ) : (
                                      <Percent className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Estimated Catch */}
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center justify-center">
                                <span className="font-medium">
                                  {species.estCatch.toFixed(2)}
                                </span>
                                {comparisonSpecies && (
                                  <div className="ml-2 flex items-center">
                                    {species.estCatch >
                                    comparisonSpecies.estCatch ? (
                                      <TrendingUp className="h-4 w-4 text-green-600" />
                                    ) : species.estCatch <
                                      comparisonSpecies.estCatch ? (
                                      <TrendingDown className="h-4 w-4 text-red-600" />
                                    ) : (
                                      <Percent className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <SpeciesTable
                  isLoading={isLoading}
                  statsData={filteredSpecies}
                />
              )}
            </div>

            {/* Empty state if no species */}
            {filteredSpecies.length === 0 &&
              reports[activeReportIndex].lowerTable.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No species match your filter criteria.</p>
                </div>
              )}
          </div>
        )}

        {/* No data message for empty report */}
        {(!reports[activeReportIndex]?.upperTables ||
          !reports[activeReportIndex]?.lowerTable?.length) &&
          !isLoading && (
            <div className="bg-white border rounded-lg p-8 text-center">
              <p className="text-gray-500">
                Use the filters above and click "Generate Report" to see
                statistics.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default AdvancedReportPage;

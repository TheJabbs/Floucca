"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Search, Loader2, RefreshCw } from "lucide-react";
import FilterSection from "@/components/workload/filter-section";
import WorkloadTable from "@/components/workload/workload-table";
import TotalSummary from "@/components/workload/total-summary";
import { fetchWorkloadStats } from "@/services/workloadService";

export interface WorkloadFilterValues {
  period?: string;
  port_id?: number[];
  coop?: number[];
  region?: number[];
}

const WorkloadStatisticsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workloadData, setWorkloadData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { handleSubmit, control, register, setValue, reset, watch } = useForm<WorkloadFilterValues>({
    defaultValues: {
      period: undefined,
      port_id: undefined,
      coop: undefined,
      region: undefined
    }
  });

  const fetchData = async (filters: WorkloadFilterValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWorkloadStats(filters);
      setWorkloadData(data);
    } catch (err: any) {
      console.error("Error fetching workload stats:", err);
      setError(err.message || "Failed to load workload statistics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // fetch data with no filters
    fetchData({});
  }, []);

  const onSubmit = (data: WorkloadFilterValues) => {
    fetchData(data);
  };

  const handleReset = () => {
    reset();
    fetchData({});
  };

  const filteredData = workloadData?.work?.filter((item: any) => 
    item.dataOperator.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Workload Statistics</h1>
        <p className="text-gray-600">
          Monitor work progress and distribution across data operators
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <FilterSection 
          control={control}
          register={register}
          setValue={setValue}
          watch={watch}
        />
        
        <div className="flex justify-between mt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by operator name..."
              className="pl-10 pr-4 py-2 border rounded-lg w-60 md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Reset Filters
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Apply Filters
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <p>{error}</p>
          <button
            onClick={() => fetchData({})}
            className="mt-2 text-blue-600 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {workloadData?.totals && (
        <TotalSummary totals={workloadData.totals} />
      )}

      <WorkloadTable 
        data={filteredData} 
        isLoading={isLoading}
        noDataMessage={searchTerm ? "No operators found matching the search criteria" : "No workload data available"}
      />
    </div>
  );
};

export default WorkloadStatisticsPage;
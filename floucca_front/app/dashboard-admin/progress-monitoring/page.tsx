"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetchWorkProgressData, WorkProgressData, WorkProgressFilter } from "@/services/progressMonitor";
import { getPorts } from "@/services/portService";
import { getPeriods } from "@/services/periodService";
import WorkProgressTable from "@/components/stats/tables/progress";

interface FormData {
  portId: number;
  period: string;
}

export default function WorkProgressMonitoringPage() {
  const [workProgressData, setWorkProgressData] = useState<WorkProgressData[]>([]);
  const [ports, setPorts] = useState<{ port_id: number; port_name: string }[]>([]);
  const [periods, setPeriods] = useState<{ period_date: string; period_status: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      portId: 0,
      period: "",
    }
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        const [portsData, periodsData] = await Promise.all([
          getPorts(),
          getPeriods()
        ]);
        
        setPorts(portsData);
        setPeriods(periodsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching metadata:", err);
        setError("Failed to load form data. Please refresh the page and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!data.portId || !data.period) {
      setError("Please select both port and period");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Format the date as "DD-MM-YYYY"
    const date = new Date(data.period);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const filter: WorkProgressFilter = {
      period: formattedDate, 
      port_id: [Number(data.portId)]
    };

      const result = await fetchWorkProgressData(filter);
      setWorkProgressData(result);
      setDataFetched(true);
    } catch (err: any) {
      console.error("Error fetching work progress data:", err);
      setError(err.message || "Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPeriodDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Progress Monitoring</h1>
        <p className="text-gray-600">
          Monitor the progress of data collection across different fishing gears and ports.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-1">
                Port <span className="text-red-500">*</span>
              </label>
              <select
                id="port"
                {...register("portId", { 
                  required: "Port is required",
                  validate: value => value > 0 || "Please select a port", 
                  valueAsNumber: true
                })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.portId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value={0}>Select a port</option>
                {ports.map((port) => (
                  <option key={port.port_id} value={port.port_id}>
                    {port.port_name}
                  </option>
                ))}
              </select>
              {errors.portId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.portId.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                Period <span className="text-red-500">*</span>
              </label>
              <select
                id="period"
                {...register("period", { required: "Period is required" })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.period ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a period</option>
                {periods
                  .sort((a, b) => new Date(b.period_date).getTime() - new Date(a.period_date).getTime())
                  .map((period) => (
                    <option key={period.period_date} value={period.period_date}>
                      {formatPeriodDate(period.period_date)} ({period.period_status})
                    </option>
                ))}
              </select>
              {errors.period && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.period.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? "Loading..." : "Generate Report"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Progress Report</h2>
        
        {!dataFetched && !isLoading && !error ? (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center text-blue-700">
            Select a port and period to generate the work progress report.
          </div>
        ) : (
          <WorkProgressTable 
            data={workProgressData} 
            isLoading={isLoading} 
            error={error} 
          />
        )}

        {workProgressData.length > 0 && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
            <h3 className="font-semibold mb-2">Report Legend</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-red-600 font-medium">Red values</span> indicate the current count is below the minimum required.</li>
              <li><span className="text-green-600 font-medium">Green values</span> indicate the requirements have been met.</li>
              <li><strong>Sampling Days</strong>: Number of days samples were collected for landing data.</li>
              <li><strong>Samples</strong>: Number of samples collected.</li>
              <li><strong>Minimum</strong>: Recommended minimum number needed for statistical accuracy.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
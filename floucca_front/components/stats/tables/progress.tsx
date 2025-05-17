import React from "react";
import { WorkProgressData } from "@/services/progressMonitor";

interface WorkProgressTableProps {
  data: WorkProgressData[];
  isLoading: boolean;
  error: string | null;
}

const WorkProgressTable: React.FC<WorkProgressTableProps> = ({ 
  data, 
  isLoading, 
  error 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
        No data available. Please select different filters or try again.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Gear Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Gear Units
            </th>
            <th scope="col" colSpan={4} className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-l border-gray-200">
              Landing
            </th>
            <th scope="col" colSpan={2} className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-l border-gray-200">
              Effort
            </th>
          </tr>
          <tr className="bg-gray-100">
            <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500"></th>
            <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500"></th>
            <th scope="col" className="px-6 py-2 text-center text-xs font-medium text-gray-500 border-l border-gray-200">
              Sampling Days
            </th>
            <th scope="col" className="px-6 py-2 text-center text-xs font-medium text-gray-500">
              Minimum Days
            </th>
            <th scope="col" className="px-6 py-2 text-center text-xs font-medium text-gray-500">
              Samples
            </th>
            <th scope="col" className="px-6 py-2 text-center text-xs font-medium text-gray-500">
              Minimum Samples
            </th>
            <th scope="col" className="px-6 py-2 text-center text-xs font-medium text-gray-500 border-l border-gray-200">
              Samples
            </th>
            <th scope="col" className="px-6 py-2 text-center text-xs font-medium text-gray-500">
              Minimum Samples
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.gearName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.gearUnit}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l border-gray-200 
                ${item.landing.samplingDays < item.landing.samplingDaysMin ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}`}>
                {item.landing.samplingDays}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                {Math.round(item.landing.samplingDaysMin)}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center 
                ${item.landing.samples < item.landing.samplesMin ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}`}>
                {item.landing.samples}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                {Math.round(item.landing.samplesMin)}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center border-l border-gray-200
                ${item.effort.samples < item.effort.samplesMin ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}`}>
                {item.effort.samples}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                {Math.round(item.effort.samplesMin)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkProgressTable;
import React from "react";
import { FileText, Users, Activity } from "lucide-react";

interface TotalSummaryProps {
  totals: {
    allEffortSample: number;
    allLaningSample: number;
    allSamples: number;
  };
}

const TotalSummary: React.FC<TotalSummaryProps> = ({ totals }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center">
        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-gray-500 text-sm">Total Landing Samples</h3>
          <p className="text-2xl font-bold">{totals.allLaningSample}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center">
        <div className="mr-4 bg-green-100 p-3 rounded-lg">
          <Activity className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-gray-500 text-sm">Total Effort Samples</h3>
          <p className="text-2xl font-bold">{totals.allEffortSample}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center">
        <div className="mr-4 bg-purple-100 p-3 rounded-lg">
          <Users className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-gray-500 text-sm">All Samples</h3>
          <p className="text-2xl font-bold">{totals.allSamples}</p>
        </div>
      </div>
    </div>
  );
};

export default TotalSummary;
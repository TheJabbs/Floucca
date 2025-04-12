import React from "react";
import { useSharedStats } from "@/contexts/SharedStatContext";

type StatCardProps = {
  title: string;
  statKey: 'ports' | 'coops' | 'regions' | 'species' | 'effortRecords' | 'landingRecords' | 'totalGears' | 'sampleCatch';
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number) => string;
};

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  statKey, 
  icon, 
  color,
  formatter = (val) => val.toString()
}) => {
  const { isLoading, getLatestPeriodStats } = useSharedStats();
  const stats = getLatestPeriodStats();
  
  // Default to 0 if stats aren't available yet
  const value = stats ? stats[statKey] : 0;
  
  return (
    <div className={`rounded-lg p-4 ${color}`}>
      <div className="flex items-center gap-4">
        <div
          className={`rounded-full p-3 ${color.replace("bg-", "bg-opacity-20 text-")}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold">{formatter(value)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
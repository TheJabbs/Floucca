import React from "react";

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className={`rounded-lg p-4 ${color}`}>
    <div className="flex items-center gap-4">
      <div
        className={`rounded-full p-3 ${color.replace("bg-", "bg-opacity-20 text-")}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default StatCard;

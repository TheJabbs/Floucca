import React from "react";
import DashboardCard from "@/components/dashboard/dashboard-card";
import DashboardButton from "@/components/utils/dashboard-button";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Administrator Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Administration Functions">
          <div className="flex flex-col gap-4">
            <DashboardButton label="Table of Users" />
            <DashboardButton label="Table of Field Agents" />
            <DashboardButton label="Workload Statistics" />
            <DashboardButton label="Work Progress Monitoring" />
          </div>
        </DashboardCard>

        <DashboardCard title="Maintenance Functions">
          <div className="flex flex-col gap-4">
            <DashboardButton label="System Backup" />
            <DashboardButton label="System Recovery" />
            <DashboardButton label="Allocation of Excel Outputs" />
            <DashboardButton label="Create Diffusable Excel" />
          </div>
        </DashboardCard>

        <DashboardCard title="Monthly Databases">
          <div className="grid grid-cols-2 gap-4">
            <DashboardButton label="Create a New Database" />
            <DashboardButton label="Use Tables of Another Database" />
            <DashboardButton label="Set Up Tables Manually" />
            <DashboardButton label="Delete a Database" />
            <DashboardButton label="Release for Inputting" />
            <DashboardButton label="Block a Database" />
            <DashboardButton label="Finalize" />
            <DashboardButton label="Move to History" />
            <DashboardButton label="Bring in from History" />
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Authorized Access">
        <div className="flex flex-wrap gap-4">
          <DashboardButton label="Privileged Users' Functions" />
          <DashboardButton label="Data Operators' Functions" />
        </div>
      </DashboardCard>
    </div>
  );
};

export default Dashboard;

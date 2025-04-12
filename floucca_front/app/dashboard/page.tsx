"use client";

import React from "react";
import {
  Fish,
  ChartLine,
  GitBranch,
  PieChart,
  Anchor,
  TrendingUp,
  Scale,
  RefreshCw,
} from "lucide-react";

import ReportCard from "@/components/dashboard/report-card";
import StatCard from "@/components/dashboard/stat-card";
import RecentActivity from "@/components/dashboard/recent-activity";
import { useSharedStats } from "@/contexts/SharedStatContext";

export default function ReportsDashboard() {
  const { statsData, isLoading, refreshStats } = useSharedStats();
  
  // Get the latest period date
  const getLatestPeriodDate = () => {
    if (!statsData || Object.keys(statsData).length === 0) return null;
    
    // Get the most recent period
    const periods = Object.keys(statsData).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    return periods.length > 0 ? periods[0] : null;
  };
  
  // Format date for display
  const latestPeriodDate = getLatestPeriodDate();
  const formattedDate = latestPeriodDate 
    ? new Date(latestPeriodDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : "fetching data...";

  const reports = [
    {
      title: "Fishing Statistics Report",
      description:
        "View effort and landing data with filterable tables by time period, gear type, and port. Includes species data bar chart visualization.",
      icon: <Fish className="h-6 w-6" />,
      color: "bg-pink-50 hover:bg-pink-100 border-pink-200",
      route: "/dashboard/stats/report",
    },
    {
      title: "Species Analytics",
      description:
        "Track monthly species metrics using line charts showing average weight, length, quantity, and price trends over time.",
      icon: <ChartLine className="h-6 w-6" />,
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      route: "/dashboard/stats/analytic",
    },
    {
      title: "Fleet Gear Usage Report",
      description:
        "Visualize monthly gear usage frequency and active days by selecting year and filtering by port, region, or cooperative.",
      icon: <GitBranch className="h-6 w-6" />,
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      route: "/dashboard/stats/fleet-report",
    },
    {
      title: "Advanced Reports",
      description:
        "Generate customized reports with detailed data filtering by gear, period, port, cooperative, region and species.",
      icon: <PieChart className="h-6 w-6" />,
      color: "bg-amber-50 hover:bg-amber-100 border-amber-200",
      route: "/dashboard/stats/adv-report",
    },
  ];

  const stats = [
    {
      title: "Active Ports",
      statKey: "ports" as const,
      icon: <Anchor className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Landing Records",
      statKey: "landingRecords" as const,
      icon: <Fish className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Effort Records",
      statKey: "effortRecords" as const,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Gears",
      statKey: "totalGears" as const,
      icon: <GitBranch className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Species Kinds",
      statKey: "species" as const,
      icon: <ChartLine className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Sample Catch",
      statKey: "sampleCatch" as const,
      icon: <Scale className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
      formatter: (value: number) => value.toFixed(1),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">REPORTS</h1>
        <p className="mt-1 text-gray-600">
          Comprehensive fisheries data reporting and analytics
        </p>
      </header>

      <div className="flex justify-between items-center mb-3">
        <p className="text-gray-800 font-medium">
          Data shown from {formattedDate}
        </p>
        
        <button 
          onClick={() => refreshStats()}
          className="text-sm px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-1 hover:bg-blue-200 transition-colors"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <h2 className="mb-4 text-xl font-semibold">Available Reports</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {reports.map((report, index) => (
          <ReportCard key={index} {...report} />
        ))}
      </div>

      <RecentActivity />
    </div>
  );
}
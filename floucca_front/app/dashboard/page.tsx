import React from "react";
import {
  Fish,
  ChartLine,
  GitBranch,
  PieChart,
  Anchor,
  TrendingUp,
  Scale,
} from "lucide-react";

import ReportCard from "@/components/dashboard/report-card";
import StatCard from "@/components/dashboard/stat-card";
import RecentActivity from "@/components/dashboard/recent-activity";

export default function ReportsDashboard() {
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
      value: "2",
      icon: <Anchor className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Landing Records",
      value: "11",
      icon: <Fish className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Effort Records",
      value: "8",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Gears",
      value: "11",
      icon: <GitBranch className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Species Kinds",
      value: "4",
      icon: <ChartLine className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Sample Catch",
      value: "592.4",
      icon: <Scale className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
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

      <div>
        <p className="mb-3 text-gray-800 font-medium">
          Data shown is from October 1, 2024
        </p>
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

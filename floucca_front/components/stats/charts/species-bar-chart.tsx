import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SpeciesBarChartProps {
  data: any[];
  isLoading: boolean;
}

type MetricType =
  | "numbOfCatch"
  | "estCatch"
  | "price"
  | "cpue"
  | "avgWeight"
  | "avgQuantity"
  | "avgLength"
  | "avgPrice"
  | "value"
  | "effort";

const SpeciesBarChart: React.FC<SpeciesBarChartProps> = ({
  data,
  isLoading,
}) => {
  const [selectedMetric, setSelectedMetric] =
    useState<MetricType>("numbOfCatch");

  // Format values for tooltips
  const valueFormatter = (value: number | null): string => {
    return value !== null ? value.toFixed(2) : "N/A";
  };

  const currencyFormatter = (value: number | null): string => {
    return value !== null
      ? `${new Intl.NumberFormat("en-US").format(value)} LBP`
      : "N/A";
  };

  const weightFormatter = (value: number | null): string => {
    return value !== null ? `${value.toFixed(2)} kg` : "N/A";
  };

  const lengthFormatter = (value: number | null): string => {
    return value !== null ? `${value.toFixed(2)} cm` : "N/A";
  };

  // Define metric configurations
  const metricConfig = {
    numbOfCatch: {
      label: "N. Catch",
      color: "#4f46e5", // indigo-600
      formatter: valueFormatter,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-800",
    },
    estCatch: {
      label: "Est. Catch",
      color: "#a855f7", // purple-500
      formatter: valueFormatter,
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
    },
    price: {
      label: "Price",
      color: "#10b981", // green-500
      formatter: currencyFormatter,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    cpue: {
      label: "CPUE",
      color: "#f59e0b", // amber-500
      formatter: valueFormatter,
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
    },
    avgWeight: {
      label: "Avg Weight",
      color: "#3b82f6", // blue-500
      formatter: weightFormatter,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    avgQuantity: {
      label: "Avg Quantity",
      color: "#ec4899", // pink-500
      formatter: valueFormatter,
      bgColor: "bg-pink-100",
      textColor: "text-pink-800",
    },
    avgLength: {
      label: "Avg Length",
      color: "#14b8a6", // teal-500
      formatter: lengthFormatter,
      bgColor: "bg-teal-100",
      textColor: "text-teal-800",
    },
    avgPrice: {
      label: "Avg Price",
      color: "#8b5cf6", // violet-500
      formatter: currencyFormatter,
      bgColor: "bg-violet-100",
      textColor: "text-violet-800",
    },
    value: {
      label: "Value",
      color: "#ef4444", // red-500
      formatter: currencyFormatter,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
    },
    effort: {
      label: "Effort",
      color: "#6366f1", // indigo-500
      formatter: valueFormatter,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-800",
    },
  };

  const prepareChartData = () => {
    if (!data || data.length === 0) return [];

    return data.map((item) => ({
      specie_name: item.specie_name,
      [selectedMetric]: item[selectedMetric],
    }));
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const formatter = metricConfig[selectedMetric].formatter;

      return (
        <div className="bg-white p-2 shadow rounded border">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">{`${
            metricConfig[selectedMetric].label
          }: ${formatter(value)}`}</p>
        </div>
      );
    }

    return null;
  };

  const metricGroups = [
    {
      title: "Catch Metrics",
      metrics: ["numbOfCatch", "estCatch", "cpue", "effort", "value"],
    },
    {
      title: "Average Metrics",
      metrics: ["avgWeight", "avgLength", "avgQuantity", "avgPrice"],
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
        No data available for chart visualization
      </div>
    );
  }

  const chartData = prepareChartData();

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-center">
        Species Data Bar Chart
      </h3>
      <div className="mb-4">
        {metricGroups.map((group, groupIndex) => (
          <div key={group.title} className={`${groupIndex > 0 ? "mt-2" : ""}`}>
            <div className="text-sm font-medium text-gray-500 mb-1">
              {group.title}
            </div>
            <div className="flex flex-wrap gap-2">
              {group.metrics.map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric as MetricType)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    selectedMetric === metric
                      ? `${metricConfig[metric as MetricType].bgColor} ${
                          metricConfig[metric as MetricType].textColor
                        }`
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {metricConfig[metric as MetricType].label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mx-auto mt-10"
        style={{ width: "100%", maxWidth: "900px", height: 400 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="specie_name"
              angle={chartData.length > 10 ? -45 : 0}
              textAnchor={chartData.length > 10 ? "end" : "middle"}
              height={chartData.length > 10 ? 100 : 60}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              align="center"
              wrapperStyle={{ marginBottom: 30, marginLeft: 30}}
            />
            <Bar
              dataKey={selectedMetric}
              name={metricConfig[selectedMetric].label}
              fill={metricConfig[selectedMetric].color}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpeciesBarChart;

"use client"
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from "recharts";
import {
  getFishStatistics,
  FishStatsResponse,
  extractUniqueMonths,
  extractUniqueSpecies,
  transformDataForChart
} from "@/services/fishStatsService";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", 
  "#00C49F", "#FFBB28", "#FF8042", "#6B8E23", "#483D8B", 
  "#CD5C5C", "#4682B4", "#D2691E", "#9370DB", "#20B2AA",
  "#B22222", "#4169E1", "#800080", "#2E8B57", "#808000"
];

const FishStatisticsChart: React.FC = () => {
  const [data, setData] = useState<FishStatsResponse>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedMonth, setSelectedMonth] = useState<string>("All Months");
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [availableSpecies, setAvailableSpecies] = useState<{ code: number, name: string }[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<number[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'avg_weight' | 'avg_quantity' | 'avg_price'>('avg_weight');
  
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      processData();
    }
  }, [data, selectedMonth, selectedSpecies, selectedMetric]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getFishStatistics();
      setData(response);
      
      const months = extractUniqueMonths(response);
      setAvailableMonths(months);
      
      const species = extractUniqueSpecies(response);
      setAvailableSpecies(species);
      
      setSelectedSpecies(species.map(s => s.code));
      
    } catch (err: any) {
      setError(err.message || "Failed to fetch fish statistics");
      console.error("Error fetching fish statistics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const processData = () => {
    let filteredData = { ...data };
    
    if (selectedMonth !== "All Months") {
      filteredData = Object.entries(data).reduce((acc: FishStatsResponse, [period, periodData]) => {
        try {
          const date = new Date(period);
          const monthName = date.toLocaleString('default', { month: 'long' });
          
          if (monthName === selectedMonth) {
            acc[period] = periodData;
          }
        } catch (e) {
          console.error(`Error parsing period date: ${period}`, e);
        }
        return acc;
      }, {});
    }
    
    // Transform data for the chart
    const transformed = transformDataForChart(
      filteredData,
      selectedMetric,
      selectedSpecies
    );
    
    setChartData(transformed);
  };

  const handleMetricChange = (metric: 'avg_weight' | 'avg_quantity' | 'avg_price') => {
    setSelectedMetric(metric);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  const toggleSpecies = (specieCode: number) => {
    setSelectedSpecies(prev => 
      prev.includes(specieCode)
        ? prev.filter(code => code !== specieCode)
        : [...prev, specieCode]
    );
  };

  const getYAxisLabel = () => {
    switch (selectedMetric) {
      case 'avg_weight':
        return 'Average Weight (kg)';
      case 'avg_quantity':
        return 'Average Quantity';
      case 'avg_price':
        return 'Average Price (LBP)';
      default:
        return '';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm flex items-center">
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-1.5"
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span style={{ color: entry.color, fontWeight: 500 }}>
                  {entry.name.split(' (')[0]}:
                </span> {' '}
                <span className="font-medium ml-1">
                  {selectedMetric === 'avg_price'
                    ? new Intl.NumberFormat('en-US').format(entry.value)
                    : Number(entry.value).toFixed(2)}
                  {selectedMetric === 'avg_weight' ? ' kg' : selectedMetric === 'avg_price' ? ' LBP' : ''}
                </span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate dynamic domain for Y axis based on data
  const calculateYDomain = () => {
    if (chartData.length === 0) return [0, 100];
    
    let allValues: number[] = [];
    chartData.forEach((entry) => {
      Object.keys(entry).forEach(key => {
        if (key !== 'period' && typeof entry[key] === 'number') {
          allValues.push(entry[key]);
        }
      });
    });
    
    if (allValues.length === 0) return [0, 100];
    
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    
    // Format max value
    const formattedMax = maxValue > 1000 
      ? Math.ceil(maxValue / 1000) * 1000 // nearest thousand for large numbers
      : Math.ceil(maxValue * 2) / 2; //nearest 0.5 for small numbers
    
    return [
      0, // start from zero
      formattedMax * 1.1 // 10% padding at the top
    ];
  };

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
        <p className="font-medium">Error loading fish statistics</p>
        <p>{error}</p>
        <button
          onClick={fetchData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Month Filter */}
        <div>
          <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Month
          </label>
          <select
            id="month-filter"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Months">All Months</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Metric Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Metric
          </label>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedMetric === 'avg_weight'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => handleMetricChange('avg_weight')}
            >
              Weight
            </button>
            <button
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedMetric === 'avg_quantity'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => handleMetricChange('avg_quantity')}
            >
              Quantity
            </button>
            <button
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedMetric === 'avg_price'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => handleMetricChange('avg_price')}
            >
              Price
            </button>
          </div>
        </div>
      </div>

      {/* Species Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Species to Display
        </label>
        <div className="flex flex-wrap gap-2">
          {availableSpecies.map((species, index) => (
            <button
              key={species.code}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center ${
                selectedSpecies.includes(species.code)
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
              }`}
              onClick={() => toggleSpecies(species.code)}
              style={{
                borderLeftWidth: '4px',
                borderLeftColor: COLORS[index % COLORS.length]
              }}
            >
              <span>
                {species.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[500px] mt-6">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 30, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period" 
                padding={{ left: 10, right: 10 }}
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                domain={calculateYDomain()}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)}k`;
                  }
                  return value.toFixed(1);
                }}
                width={70}
              >
                <Label
                  value={getYAxisLabel()}
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: 'middle', fontSize: 12 }}
                  offset={-15}
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              
              {availableSpecies
                .filter(species => selectedSpecies.includes(species.code))
                .map((species, index) => {
                  const dataKey = `${species.name} (${species.code})`;
                  const colorIndex = availableSpecies.findIndex(s => s.code === species.code);
                  return (
                    <Line
                      key={species.code}
                      type="monotone"
                      dataKey={dataKey}
                      stroke={COLORS[colorIndex % COLORS.length]}
                      activeDot={{ r: 8 }}
                      dot={{ r: 4 }}
                      strokeWidth={2}
                      name={dataKey}
                    />
                  );
                })}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">
              {selectedSpecies.length === 0
                ? "Please select at least one species to display"
                : "No data available for the selected filters"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FishStatisticsChart;
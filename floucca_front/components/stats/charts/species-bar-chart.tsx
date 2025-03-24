import React, { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

interface SpeciesBarChartProps {
  data: any[];
  isLoading: boolean;
}

const SpeciesBarChart: React.FC<SpeciesBarChartProps> = ({ data, isLoading }) => {
  const [selectedMetric, setSelectedMetric] = useState<'estCatch' | 'price' | 'cpue'>('estCatch');
  
  // Format values for tooltips
  const valueFormatter = (value: number | null): string => {
    return value !== null ? value.toFixed(2) : 'N/A';
  };
  
  // Format price values for tooltips
  const priceFormatter = (value: number | null): string => {
    return value !== null ? `${new Intl.NumberFormat('en-US').format(value)} LBP` : 'N/A';
  };
  
  // Define colors for each metric
  const colors = {
    estCatch: '#a855f7', // purple-500
    price: '#10b981',    // green-500
    cpue: '#f59e0b'      // amber-500
  };
  
const chartSetting = React.useMemo(() => ({
    yAxis: [
        {
            label: ""
        },
    ],
    height: 400,
    sx: {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
        },
    },
}), [selectedMetric]);

  const prepareChartData = () => {
    if (!data || data.length === 0) return { dataset: [], series: [] };
    
    // Transform the data into the format expected by Material UI
    const dataset = data.map(item => ({
      species: item.species,
      estCatch: item.estCatch,
      price: item.price,
      cpue: item.cpue
    }));
    
    // Define the series based on selected metric with color
    let series: { dataKey: string; label: string; valueFormatter: (value: number | null) => string; color: string }[] = [];
    
    if (selectedMetric === 'estCatch') {
      series = [{ 
        dataKey: 'estCatch', 
        label: 'Est. Catch', 
        valueFormatter,
        color: colors.estCatch
      }];
    } else if (selectedMetric === 'price') {
      series = [{ 
        dataKey: 'price', 
        label: 'Price', 
        valueFormatter: priceFormatter,
        color: colors.price
      }];
    } else if (selectedMetric === 'cpue') {
      series = [{ 
        dataKey: 'cpue', 
        label: 'CPUE', 
        valueFormatter,
        color: colors.cpue
      }];
    }
    
    return { dataset, series };
  };

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

  const { dataset, series } = prepareChartData();
  
  return (
    <div className="mt-6">
      <div className="mb-4 flex justify-center space-x-2">
        <button
          onClick={() => setSelectedMetric('estCatch')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            selectedMetric === 'estCatch' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Est. Catch
        </button>
        <button
          onClick={() => setSelectedMetric('price')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            selectedMetric === 'price' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Price
        </button>
        <button
          onClick={() => setSelectedMetric('cpue')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            selectedMetric === 'cpue' 
              ? 'bg-amber-100 text-amber-800' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          CPUE
        </button>
      </div>
      
      <div className="mx-auto" style={{ width: '100%', maxWidth: '900px' }}>
        <BarChart
          dataset={dataset}
          xAxis={[{ 
            scaleType: 'band', 
            dataKey: 'species',
            tickLabelStyle: {
              textAnchor: 'middle',
              fontSize: 14
            }
          }]}
          series={series}
          {...chartSetting}
        />
      </div>
    </div>
  );
};

export default SpeciesBarChart;
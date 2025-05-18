import React from 'react';
import { usePeriod } from '@/contexts/PeriodContext';

interface Period {
  period_date: string;
  period_status: string;
}

interface PeriodDropdownProps {
  periods: Period[];
  onPeriodChange?: (periodDate: string | null) => void;
  className?: string;
  required?: boolean;
}

const formatPeriodDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  })}`;
};

const PeriodDropdown: React.FC<PeriodDropdownProps> = ({ 
  periods, 
  onPeriodChange, 
  className,
  required = false 
}) => {
  const { selectedPeriod, setSelectedPeriod } = usePeriod();

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const periodDate = event.target.value || null;
    setSelectedPeriod(periodDate);
    onPeriodChange?.(periodDate);
  };

  // Sort periods by date, most recent first
  const sortedPeriods = [...periods].sort((a, b) => 
    new Date(b.period_date).getTime() - new Date(a.period_date).getTime()
  );

  return (
    <div className={`${className || ''}`}>
      <label htmlFor="period-select" className="block text-sm font-medium text-gray-700 mb-1">
        Select Period 
        {required && <span className="text-red-500">*</span>}
        {!required && <span className="text-gray-500 text-xs ml-1">(Optional - defaults to current)</span>}
      </label>
      <select
        id="period-select"
        value={selectedPeriod || ""}
        onChange={handlePeriodChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">
          Use current period
        </option>
        {sortedPeriods.map((period) => (
          <option key={period.period_date} value={period.period_date}>
            {formatPeriodDate(period.period_date)} - {period.period_status}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PeriodDropdown;
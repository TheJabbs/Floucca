"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Calendar } from "lucide-react";

interface Period {
  period_date: string;
  period_status: string;
}

interface PeriodSelectionProps {
  periods: Period[];
  onPeriodChange: (selectedPeriod: string | null) => void;
  isLoading?: boolean;
}

interface FormValues {
  selectedPeriod: string | null;
}

const PeriodSelection: React.FC<PeriodSelectionProps> = ({
  periods,
  onPeriodChange,
  isLoading = false,
}) => {
  const { control } = useForm<FormValues>({
    defaultValues: {
      selectedPeriod: null,
    },
  });

  // Format the period date for display
  const formatPeriodDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow border animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow border">
      <h3 className="font-medium mb-2">Select Time Period</h3>
      
      <Controller
        control={control}
        name="selectedPeriod"
        render={({ field }) => (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            
            <select
              className="pl-10 pr-4 py-2 w-full border rounded-lg appearance-none bg-white"
              value={field.value || ""}
              onChange={(e) => {
                const value = e.target.value === "all" ? null : e.target.value;
                field.onChange(value);
                onPeriodChange(value);
              }}
            >
              <option value="all">All Periods</option>
              {periods
                .slice()
                .sort((a, b) => new Date(b.period_date).getTime() - new Date(a.period_date).getTime())
                .map((period) => (
                  <option key={period.period_date} value={period.period_date}>
                    {formatPeriodDate(period.period_date)} ({period.period_status})
                  </option>
                ))}
            </select>
            
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default PeriodSelection;
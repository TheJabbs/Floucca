'use client';

import React, { useEffect, useState } from 'react';
import { getPeriods, updatePeriodStatus, Period } from '@/services/periodService';
import { formatDate } from '../utils/dateUtils';
import ActiveDaysSection from './activeDaysSection';

const statusOptions = [
  { label: 'Active', value: 'A' },
  { label: 'Blocked', value: 'B' },
  { label: 'Finalized', value: 'F' },
];

const statusMap: Record<'A' | 'B' | 'F', string> = {
  A: 'Active',
  B: 'Blocked',
  F: 'Finalized',
};

const ManagePeriods = () => {
  const [periods, setPeriods] = useState<Period[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPeriods();
      if (Array.isArray(data)) {
        setPeriods(data);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (period_date: string, newStatus: 'A' | 'B' | 'F') => {
    try {
      await updatePeriodStatus({ period_date, period_status: newStatus });
      setPeriods((prev) =>
        prev.map((p) =>
          p.period_date === period_date ? { ...p, period_status: newStatus } : p
        )
      );
    } catch (err) {
      console.error('Error updating period:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📆 Manage Periods</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold text-xl mb-4">All Periods</h3>
        <ul className="space-y-3">
          {periods.map((period) => (
            <li
              key={period.period_date}
              className="bg-gray-100 p-3 rounded flex items-center justify-between"
            >
              <span>{formatDate(period.period_date)}</span>

              <select
                className="ml-4 border border-gray-300 px-2 py-1 rounded"
                value={period.period_status}
                onChange={(e) =>
                  handleStatusChange(
                    period.period_date,
                    e.target.value as 'A' | 'B' | 'F'
                  )
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </div>

      <ActiveDaysSection />
    </div>
  );
};

export default ManagePeriods;

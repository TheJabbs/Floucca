'use client';

import React, { useEffect, useState } from 'react';
import {
  getPeriodActiveDays,
  ActiveDaysEntry,
} from '@/services/periodService';
import { Port } from '@/services/portService';
import { Gear } from '@/services/gearService';
import { getDaysInMonthByDate } from '../utils/dateUtils';

interface Props {
  period: { period_date: string };
  ports: Port[];
  gears: Gear[];
  getDaysInMonthByDate: (date: string) => number;
}

const ActiveDaysManager: React.FC<Props> = ({ period, ports, gears }) => {
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
  const [selectedGear, setSelectedGear] = useState<string>('');
  const [activeDays, setActiveDays] = useState<number>(28);
  const [maxDays, setMaxDays] = useState<number>(31);

  useEffect(() => {
    const days = getDaysInMonthByDate(period.period_date);
    setMaxDays(days);
  }, [period]);

  const handleActiveDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value <= maxDays && value >= 1) {
      setActiveDays(value);
    }
  };

  return (
    <div className="mt-4 border-t pt-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div>
          <label className="font-medium block mb-1">Select Port:</label>
          <select
            className="border px-2 py-1 rounded"
            value={selectedPort ?? ''}
            onChange={(e) => setSelectedPort(Number(e.target.value))}
          >
            <option value="">-- Choose Port --</option>
            {ports.map((port) => (
              <option key={port.port_id} value={port.port_id}>
                {port.port_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium block mb-1">Select Gear:</label>
          <select
            className="border px-2 py-1 rounded"
            value={selectedGear}
            onChange={(e) => setSelectedGear(e.target.value)}
          >
            <option value="">-- Choose Gear --</option>
            {gears.map((gear) => (
              <option key={gear.gear_code} value={gear.gear_code}>
                {gear.gear_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium block mb-1">Active Days:</label>
          <input
            type="number"
            className="border px-2 py-1 rounded w-24"
            min={1}
            max={maxDays}
            value={activeDays}
            onChange={handleActiveDaysChange}
          />
          <span className="text-sm ml-2 text-gray-500">/ {maxDays} days</span>
        </div>
      </div>

      {/* Submit button placeholder for next step */}
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          console.log({
            port_id: selectedPort,
            gear_code: selectedGear,
            period_date: period.period_date,
            active_days: activeDays,
          });
        }}
      >
        ✅ Update Active Days
      </button>
    </div>
  );
};

export default ActiveDaysManager;

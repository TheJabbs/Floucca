'use client';

import React, { useState, useEffect } from 'react';
import AddButton from '../utils/form-button';

interface GearUsageEntry {
  gearId: number;
  timesUsed: number;
}

interface Gear {
  gear_code: number;
  gear_name: string;
}

interface EffortLastWeekProps {
  onChange: (gearUsage: GearUsageEntry[]) => void;
}

const EffortLastWeek: React.FC<EffortLastWeekProps> = ({ onChange }) => {
  const [gearUsage, setGearUsage] = useState<GearUsageEntry[]>([]);
  const [selectedGearId, setSelectedGearId] = useState<number | null>(null);
  const [timesUsed, setTimesUsed] = useState<number>(1);
  const [availableGears, setAvailableGears] = useState<Gear[]>([]);

  useEffect(() => {
    const fetchGears = async () => {
      try {
        const response = await fetch(process.env.GET_ALL_GEARS || "");
        if (!response.ok) {
          throw new Error('Failed to fetch gears');
        }
        const gears = await response.json();
        console.log("The gears are: ", gears);
        setAvailableGears(gears);
      } catch (error) {
        console.error('Error fetching gears:', error);
      }
    };

    fetchGears();
  }, []);

  useEffect(() => {
    onChange(gearUsage);
  }, [gearUsage, onChange]);

  const addGearUsage = () => {
    if (!selectedGearId || gearUsage.length >= 20) return;

    const gearToAdd = availableGears.find(gear => gear.gear_code === selectedGearId);
    if (gearToAdd && !gearUsage.some(entry => entry.gearId === selectedGearId)) {
      setGearUsage(prev => [...prev, { gearId: selectedGearId, timesUsed }]);
    }

    setSelectedGearId(null);
    setTimesUsed(1);
  };

  const removeGearUsage = (gearId: number) => {
    setGearUsage(prev => prev.filter(entry => entry.gearId !== gearId));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Effort Last Week</h2>

      <div className="flex gap-4">
        {/* Gear Selection Dropdown */}
        <select
          value={selectedGearId ?? ''}
          onChange={(e) => setSelectedGearId(Number(e.target.value))}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Gear</option>
          {availableGears.map(gear => (
            <option key={gear.gear_code} value={gear.gear_code}>
              {gear.gear_name}
            </option>
          ))}
        </select>

        {/* Times Used Input */}
        <input
          type="number"
          value={timesUsed}
          onChange={(e) => setTimesUsed(Math.max(1, Math.min(7, Number(e.target.value))))}
          min={1}
          max={7}
          className="w-20 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Add Button (Disabled if 20 gears added) */}
        <AddButton onClick={addGearUsage} disabled={!selectedGearId || gearUsage.length >= 20} />
      </div>

      {/* Display Added Gears */}
      <div className="space-y-3">
        {gearUsage.map((entry, index) => (
          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
            <span className="font-medium">
              {availableGears.find(g => g.gear_code === entry.gearId)?.gear_name}
            </span>
            <span className="text-gray-600">
              Times Used: {entry.timesUsed}
            </span>
            <button
              type="button"
              onClick={() => removeGearUsage(entry.gearId)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Message when limit is reached */}
      {gearUsage.length >= 20 && (
        <p className="text-red-500">You can only add up to 20 gears.</p>
      )}
    </div>
  );
};

export default EffortLastWeek;

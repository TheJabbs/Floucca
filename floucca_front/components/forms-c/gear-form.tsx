'use client';

import React, { useState, useEffect } from 'react';
import AddButton from '../utils/form-button';

interface GearEntry {
  gear_code: number;
  months: number[];
}

interface Gear {
  gear_code: number;
  gear_name: string;
}

interface GearInfoProps {
  onChange: (gearEntries: GearEntry[]) => void;
}

const GearInfo: React.FC<GearInfoProps> = ({ onChange }) => {
  const [gearEntries, setGearEntries] = useState<GearEntry[]>([]);
  const [currentSelection, setCurrentSelection] = useState<GearEntry>({ gear_code: 0, months: [] });
  const [availableGears, setAvailableGears] = useState<Gear[]>([]);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    // API call for available gears
    const fetchGears = async () => {
      try {
        const sampleGears: Gear[] = [
          { gear_code: 1, gear_name: 'Trawl Net' },
          { gear_code: 2, gear_name: 'Gill Net' },
          { gear_code: 3, gear_name: 'Long Line' },
          { gear_code: 4, gear_name: 'Trap' },
        ];
        setAvailableGears(sampleGears);
      } catch (error) {
        console.error('Error fetching gears:', error);
      }
    };
    fetchGears();
  }, []);

  useEffect(() => {
    onChange(gearEntries);
  }, [gearEntries, onChange]);

  // Filter available gears that haven't been selected yet
  const remainingGears = availableGears.filter(
    (gear) => !gearEntries.some((entry) => entry.gear_code === gear.gear_code)
  );

  const toggleMonth = (month: number) => {
    setCurrentSelection((prev) => ({
      ...prev,
      months: prev.months.includes(month)
        ? prev.months.filter((m) => m !== month)
        : [...prev.months, month].sort((a, b) => a - b),
    }));
  };

  const addGear = () => {
    if (currentSelection.gear_code === 0 || currentSelection.months.length === 0) return;

    setGearEntries((prev) => [...prev, currentSelection]);
    setCurrentSelection({ gear_code: 0, months: [] });
  };

  const removeGear = (index: number) => {
    setGearEntries((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Gear Used This Year</h2>

      <div className="flex flex-col gap-4">
        {/* Gear Selection */}
        <div className="flex items-center gap-5">
          <select
            value={currentSelection.gear_code}
            onChange={(e) => setCurrentSelection((prev) => ({ ...prev, gear_code: Number(e.target.value) }))}
            className="w-40 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={remainingGears.length === 0}
            aria-label="Select gear type"
          >
            <option value={0}>Select Gear</option>
            {remainingGears.map((gear) => (
              <option key={gear.gear_code} value={gear.gear_code}>
                {gear.gear_name}
              </option>
            ))}
          </select>

          {/* Month Selection */}
          <div className="flex flex-wrap gap-2">
            {months.map((month) => (
              <button
                key={month}
                type="button"
                onClick={() => toggleMonth(month)}
                className={`w-8 h-8 rounded-full flex items-center justify-center border text-sm transition-colors ${
                  currentSelection.months.includes(month)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
                aria-label={`Toggle month ${month}`}
              >
                {month}
              </button>
            ))}
          </div>

          {/* Add Gear Button */}
          <AddButton onClick={addGear} disabled={currentSelection.gear_code === 0 || currentSelection.months.length === 0} />
        </div>

        {/* Display Added Gears */}
        {gearEntries.length > 0 ? (
          <div className="space-y-3 mt-6">
            {gearEntries.map((entry, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
                <span className="font-medium">
                  {availableGears.find((g) => g.gear_code === entry.gear_code)?.gear_name}
                </span>
                <span className="text-gray-600">Months: {entry.months.join(', ')}</span>
                <button onClick={() => removeGear(index)} className="ml-auto text-red-500 hover:text-red-700">
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No gear added yet.</p>
        )}
      </div>
    </div>
  );
};

export default GearInfo;

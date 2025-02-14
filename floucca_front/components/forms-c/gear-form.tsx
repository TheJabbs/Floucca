'use client'

import React, { useState, useEffect } from 'react';
import AddButton from '../utils/form-button';

interface GearEntry {
  gearId: number;
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
  const [currentGear, setCurrentGear] = useState<number>(0);
  const [currentMonths, setCurrentMonths] = useState<number[]>([]);
  const [availableGears, setAvailableGears] = useState<Gear[]>([]);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    // Fetch gears from API 
    const fetchGears = async () => {
      try {
        // replace with API call
        const sampleGears: Gear[] = [
          { gear_code: 1, gear_name: "Trawl Net" },
          { gear_code: 2, gear_name: "Gill Net" },
          { gear_code: 3, gear_name: "Long Line" },
          { gear_code: 4, gear_name: "Trap" }
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

  //filtering out already selected ones
  const remainingGears = availableGears.filter(
    gear => !gearEntries.some(entry => entry.gearId === gear.gear_code)
  );

  const toggleMonth = (month: number) => {
    setCurrentMonths(prev => 
      prev.includes(month)
        ? prev.filter(m => m !== month)
        : [...prev, month].sort((a, b) => a - b)
    );
  };

  const addGear = () => {
    if (currentGear === 0 || currentMonths.length === 0) return;
    
    setGearEntries(prev => [
      ...prev,
      { gearId: currentGear, months: currentMonths }
    ]);
    
    setCurrentGear(0);
    setCurrentMonths([]);
  };

  const removeGear = (index: number) => {
    setGearEntries(prev => prev.filter((_, i) => i !== index));
  };

  // Check if form is valid for submission
  const isValidEntry = currentGear !== 0 && currentMonths.length > 0;

  return (
    <div className="space-y-4">
      <h2>Gear used in this year</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-6">
          <div className="space-y-2">
            <select
              value={currentGear}
              onChange={(e) => setCurrentGear(Number(e.target.value))}
              className={`
                w-48 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                ${currentGear === 0 ? 'border-gray-300' : 'border-green-500'}
              `}
            >
              <option value={0}>Select Gear</option>
              {remainingGears.map(gear => (
                <option key={gear.gear_code} value={gear.gear_code}>
                  {gear.gear_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {months.map(month => (
                <button
                  key={month}
                  type="button"
                  onClick={() => toggleMonth(month)}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    border text-sm transition-colors
                    ${currentMonths.includes(month)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }
                  `}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          <AddButton onClick={addGear} disabled={!isValidEntry} />
        </div>

        {/* display added gears */}
        <div className="space-y-3 mt-6">
          {gearEntries.map((entry, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
              <span className="font-medium">
                {availableGears.find(g => g.gear_code === entry.gearId)?.gear_name}
              </span>
              <span className="text-gray-600">
                Months: {entry.months.join(', ')}
              </span>
              <button
                onClick={() => removeGear(index)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GearInfo;
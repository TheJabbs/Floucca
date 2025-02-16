'use client';

import React, { useState, useEffect } from 'react';
import GearForm from './gear-form';
import AddButton from '../utils/form-button';

interface EffortTodayProps {
  onChange: (effort: { hoursFished: number; gearUsed: { gear_code: number; specs?: string }[] }) => void;
}

const EffortTodayForm: React.FC<EffortTodayProps> = ({ onChange }) => {
  const [hoursFished, setHoursFished] = useState<number>(0);
  const [selectedGears, setSelectedGears] = useState<{ gear_code: number; specs?: string }[]>([]);

  useEffect(() => {
    onChange({ hoursFished, gearUsed: selectedGears });
  }, [hoursFished, selectedGears, onChange]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHoursFished(Number(e.target.value));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Effort Today</h2>

      {/* Hours Fished Input */}
      <div className="flex flex-col">
        <label className="font-medium">Hours Fished</label>
        <input
          type="number"
          value={hoursFished || ''}
          onChange={handleHoursChange}
          min={0}
          max={24}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Gear Selection using GearForm */}
      <GearForm mode="effortToday" onChange={(gears) => setSelectedGears([...gears])} />
      
      {/* Display selected gears to keep them visible */}
      <div className="space-y-3">
        {selectedGears.length > 0 ? (
          selectedGears.map((gear, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
              <span className="font-medium">Gear {gear.gear_code} - {gear.specs || 'No specs'}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No gear added yet.</p>
        )}
      </div>
    </div>
  );
};

export default EffortTodayForm;

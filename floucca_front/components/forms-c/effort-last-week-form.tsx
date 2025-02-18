'use client';

import React, { useState } from 'react';
import GearForm from '../forms-c/gear-form';

interface GearEntry {
  gear_code: number;
  times_used: number; 
}

interface EffortLastWeekProps {
  onChange: (gearEntries: GearEntry[]) => void;
}

const EffortLastWeek: React.FC<EffortLastWeekProps> = ({ onChange }) => {
  const [gearEntries, setGearEntries] = useState<GearEntry[]>([]);

  const handleGearChange = (entries: GearEntry[]) => {
    const fixedEntries = entries.map(entry => ({
      ...entry,
      times_used: entry.times_used ?? 1,  // Default value if undefined
    }));

    setGearEntries(fixedEntries);
    onChange(fixedEntries);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Effort Last Week</h2>

      {/* Use GearForm with mode="effortLastWeek" */}
      <GearForm mode="effortLastWeek" onChange={handleGearChange} />

      <div className="space-y-3">
        {gearEntries.length === 0 && <p className="text-gray-500 italic">No gear added yet.</p>}
        {gearEntries.map((entry, index) => (
          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
            <span className="font-medium">Gear Code: {entry.gear_code}</span>
            <span className="text-gray-600">Times Used: {entry.times_used}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EffortLastWeek;

'use client';

import React, { useState, useEffect } from 'react';
import AddButton from '../utils/form-button';

interface GearUsed {
  gearId: number;
  gearName: string;
  gearSpec?: string; 
}

interface EffortTodayProps {
  availableGears: GearUsed[]; 
  onChange: (effort: { hoursFished: number; gearUsed: GearUsed[] }) => void;
}

const EffortTodayForm: React.FC<EffortTodayProps> = ({ availableGears, onChange }) => {
  const [hoursFished, setHoursFished] = useState<number>(0);
  const [selectedGears, setSelectedGears] = useState<GearUsed[]>([]);
  const [selectedGearId, setSelectedGearId] = useState<number | null>(null);
  const [gearSpec, setGearSpec] = useState<string>('');

  useEffect(() => {
    onChange({ hoursFished, gearUsed: selectedGears });
  }, [hoursFished, selectedGears, onChange]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHoursFished(Number(e.target.value));
  };

  const addGear = () => {
    if (!selectedGearId || gearSpec.trim() === '') return;

    const gearToAdd = availableGears.find(gear => gear.gearId === selectedGearId);
    if (gearToAdd && !selectedGears.some(gear => gear.gearId === selectedGearId)) {
      setSelectedGears(prev => [...prev, { ...gearToAdd, gearSpec }]);
    }

    setSelectedGearId(null);
    setGearSpec('');
  };

  const removeGear = (gearId: number) => {
    setSelectedGears(prev => prev.filter(gear => gear.gearId !== gearId));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Effort Today</h2>

      
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
   
      <div className="space-y-4">
        <h3 className="font-medium">Gear Used & Specifications</h3>

        <div className="flex gap-4">
        
          <select
            value={selectedGearId ?? ''}
            onChange={(e) => setSelectedGearId(Number(e.target.value))}
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gear</option>
            {availableGears.map(gear => (
              <option key={gear.gearId} value={gear.gearId}>
                {gear.gearName}
              </option>
            ))}
          </select>

        
          <input
            type="text"
            value={gearSpec}
            onChange={(e) => setGearSpec(e.target.value)}
            placeholder="Enter gear specifications (e.g., Net 20m²)"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <AddButton 
            onClick={addGear} 
            disabled={!selectedGearId || gearSpec.trim() === ''} 
          />
        </div>

        
        <div className="space-y-3">
          {selectedGears.map((gear, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
              <span className="font-medium">{gear.gearName} - {gear.gearSpec}</span>
              <button
                type="button"
                onClick={() => removeGear(gear.gearId)}
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

export default EffortTodayForm;

import React, { useState } from 'react';
import { AlertCircle, Trash2, Plus } from 'lucide-react';

interface Gear {
  gear_code: number;
  gear_name: string;
  equipment_id: string;
  equipment_name: string;
}

interface GearUsageProps {
  gears: Gear[];
  onChange: (data: { gear_code: number; months: number[] }[]) => void;
  required?: boolean;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const GearUsageForm: React.FC<GearUsageProps> = ({ gears, onChange, required = false }) => {
  const [selectedGears, setSelectedGears] = useState<Array<{ 
    gear_code: number; 
    gear_name: string; 
    months: number[] 
  }>>([]);
  
  const [currentSelection, setCurrentSelection] = useState({
    gear_code: 0,
    months: [] as number[]
  });

  const availableGears = gears.filter(gear => 
    !selectedGears.some(selected => selected.gear_code === gear.gear_code)
  );

  const handleGearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSelection(prev => ({
      ...prev,
      gear_code: Number(e.target.value)
    }));
  };

  const handleMonthToggle = (month: number) => {
    setCurrentSelection(prev => {
      const months = prev.months.includes(month)
        ? prev.months.filter(m => m !== month)
        : [...prev.months, month].sort((a, b) => a - b);
      return { ...prev, months };
    });
  };

  const handleAddGear = () => {
    if (currentSelection.gear_code === 0 || currentSelection.months.length === 0) return;

    const selectedGear = gears.find(g => g.gear_code === currentSelection.gear_code);
    if (selectedGear) {
      const newGear = {
        gear_code: selectedGear.gear_code,
        gear_name: selectedGear.gear_name,
        months: currentSelection.months
      };
      
      const updatedGears = [...selectedGears, newGear];
      setSelectedGears(updatedGears);
      onChange(updatedGears);
      
      setCurrentSelection({ gear_code: 0, months: [] });
    }
  };

  const handleRemoveGear = (index: number) => {
    const updatedGears = selectedGears.filter((_, i) => i !== index);
    setSelectedGears(updatedGears);
    onChange(updatedGears);
  };

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <h2 className="text-xl font-semibold text-gray-600">Fleet Gear Usage</h2>
      
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Gear {required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={currentSelection.gear_code}
            onChange={handleGearChange}
            className="w-48 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            disabled={availableGears.length === 0}
          >
            <option value={0}>Select a gear</option>
            {availableGears.map(gear => (
              <option key={gear.gear_code} value={gear.gear_code}>
                {gear.gear_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Months {required && <span className="text-red-500">*</span>}
          </label>
          <div className="flex gap-1">
            {MONTHS.map(month => (
              <button
                key={month}
                type="button"
                onClick={() => handleMonthToggle(month)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
                  ${currentSelection.months.includes(month)
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-blue-400'
                  }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleAddGear}
            disabled={currentSelection.gear_code === 0 || currentSelection.months.length === 0}
            className="inline-flex items-center px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {selectedGears.length > 0 ? (
        <div className="space-y-2 mt-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            Added Gear Usage
          </h3>
          <div className="divide-y divide-gray-100">
            {selectedGears.map((gear, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg transition-colors my-2"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-900">
                      {gear.gear_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Used in months: {gear.months.join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveGear(index)}
                    className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500 italic text-center py-6 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          No gear usage recorded yet.
        </div>
      )}
    </div>
  );
};

export default GearUsageForm;
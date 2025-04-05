"use client";
import React, { useState } from 'react';
import { AlertCircle, Trash2, Plus } from 'lucide-react';
import { Control, useFieldArray, useWatch } from "react-hook-form";

interface Gear {
  gear_code: number;
  gear_name: string;
  equipment_id: string;
  equipment_name: string;
}

interface GearFormData {
  gear_code: number;
  months: number[];
}

interface GearUsageProps {
  gears: Gear[];
  required?: boolean;
  control: Control<any>;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const GearUsageForm: React.FC<GearUsageProps> = ({ gears, required = false, control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "gearData"
  });
  
  const [currentGearCode, setCurrentGearCode] = useState<number>(0);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);

  const currentGearData = useWatch({
    control,
    name: "gearData",
    defaultValue: []
  }) as GearFormData[];

  const availableGears = gears.filter(gear => 
    !currentGearData.some((selected: GearFormData) => selected.gear_code === gear.gear_code)
  );

  const handleGearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentGearCode(Number(e.target.value));
  };

  const handleMonthToggle = (month: number) => {
    setSelectedMonths(prev => 
      prev.includes(month)
        ? prev.filter(m => m !== month)
        : [...prev, month].sort((a, b) => a - b)
    );
  };

  const handleAddGear = () => {
    if (currentGearCode === 0 || selectedMonths.length === 0) return;

    append({
      gear_code: currentGearCode,
      months: selectedMonths
    });

    setCurrentGearCode(0);
    setSelectedMonths([]);
  };

  const getGearName = (gearCode: number) => {
    const gear = gears.find(g => g.gear_code === gearCode);
    return gear ? gear.gear_name : `Gear ${gearCode}`;
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
            value={currentGearCode}
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
                  ${selectedMonths.includes(month)
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
            disabled={currentGearCode === 0 || selectedMonths.length === 0}
            className="inline-flex items-center px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {fields.length > 0 ? (
        <div className="space-y-2 mt-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            Added Gear Usage
          </h3>
          <div className="divide-y divide-gray-100">
            {fields.map((field, index) => {
              const fieldData = field as unknown as GearFormData & { id: string };
              return (
                <div
                  key={field.id}
                  className="p-4 bg-gray-50 rounded-lg transition-colors my-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-gray-900">
                        {getGearName(fieldData.gear_code)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Used in months: {fieldData.months.join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(index)}
                      className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
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
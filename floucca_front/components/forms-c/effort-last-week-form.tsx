"use client";

import React, { useState } from "react";
import { useFieldArray, Control } from "react-hook-form";
import { Plus, AlertCircle, Trash2 } from "lucide-react";

interface Gear {
  gear_code: number;
  gear_name: string;
  equipment_id: string;
  equipment_name: string;
}

interface EffortLastWeekProps {
  required?: boolean;
  gears: Gear[];
  control: Control<any>;
}

const EffortLastWeek: React.FC<EffortLastWeekProps> = ({
  required = false,
  gears,
  control,
}) => {
  const [currentGear, setCurrentGear] = useState<{
    gear_code: number;
    days_used: string;
  }>({
    gear_code: 0,
    days_used: "",
  });
  

  const { fields, append, remove } = useFieldArray<{
    effortLastWeek: {
      gear_entries: { gear_code: number; days_used: number }[];
    };
  }>({
    control,
    name: "effortLastWeek.gear_entries",
  });

  const handleGearChange = (gearCode: number) => {
    setCurrentGear((prev) => ({
      ...prev,
      gear_code: Number(gearCode),
    }));
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-7]?$/.test(value)) {
      setCurrentGear((prev) => ({
        ...prev,
        days_used: value,
      }));
    }
  };

  

  const addGear = () => {
    const parsedDays = parseInt(currentGear.days_used);
    if (
      isNaN(parsedDays) ||
      parsedDays < 0 ||
      parsedDays > 7
    )
      return;
  
    append({
      gear_code: currentGear.gear_code,
      days_used: parsedDays,
    });
  
    setCurrentGear({
      gear_code: 0,
      days_used: "1",
    });
  };
  

  const remainingGears = gears.filter(
    (gear) => !fields.some((entry) => entry.gear_code === gear.gear_code)
  );

  const getGearName = (gear_code: number) => {
    return gears.find((g) => g.gear_code === gear_code)?.gear_name || "";
  };

  const isAddDisabled = currentGear.days_used === ""

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="flex items-center gap-3 text-gray-600">
        <h2 className="text-xl font-semibold">Effort Last Week</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Gear Used Last Week
                {required && <span className="text-red-500">*</span>}
              </label>
              <select
                value={currentGear.gear_code}
                onChange={(e) => handleGearChange(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={remainingGears.length === 0}
              >
                <option value={0}>Select Gear</option>
                {remainingGears.map((gear) => (
                  <option key={gear.gear_code} value={gear.gear_code}>
                    {gear.gear_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Days Used Last Week
                {required && <span className="text-red-500">*</span>}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={7}
                  value={currentGear.days_used}
                  onChange={handleDaysChange}
                  placeholder="1 to 7 days"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={addGear}
            disabled={isAddDisabled}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            type="button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Gear Usage
          </button>
        </div>

        {fields.length > 0 ? (
          <div className="space-y-1">
            <h3 className="font-medium text-gray-700 flex items-center gap-2">
              Added Gear Usage
            </h3>
            <div className="divide-y divide-gray-100 space-y-3">
              {fields.map((entry, index) => (
                <div
                  key={entry.id}
                  className="p-4 bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-gray-900">
                        {getGearName(entry.gear_code)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Used for {entry.days_used} day
                        {entry.days_used > 1 ? "s" : ""} last week
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
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 italic text-center py-1 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            No gear usage recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default EffortLastWeek;

"use client";

import React, { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import AddButton from "../utils/form-button";

interface EffortLastWeekProps {
  required?: boolean;
  onChange: (effortData: EffortLastWeekData) => void;
}

interface GearEntry {
  gear_code: number;
  days_used: number;
}

interface EffortLastWeekData {
  gear_entries: GearEntry[];
}

//replace with actual data from backend
const GEARS = [
  { gear_code: 1, gear_name: "Fishing Net" },
  { gear_code: 2, gear_name: "Fishing Rod" },
  { gear_code: 3, gear_name: "Long Line" },
  { gear_code: 4, gear_name: "Trap" },
];

const EffortLastWeek: React.FC<EffortLastWeekProps> = ({ required = false, onChange }) => {
  const [currentGear, setCurrentGear] = useState<GearEntry>({
    gear_code: 0,
    days_used: 1,
  });

  const { control } = useForm<EffortLastWeekData>({
    defaultValues: {
      gear_entries: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "gear_entries",
  });

  // Update parent when fields change
  useEffect(() => {
    onChange({ gear_entries: fields });
  }, [fields, onChange]);

  const remainingGears = GEARS.filter(
    (gear) => !fields.some((entry) => entry.gear_code === gear.gear_code)
  );

  const handleGearChange = (gearCode: number) => {
    setCurrentGear((prev) => ({
      ...prev,
      gear_code: Number(gearCode),
    }));
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= 7) {
      setCurrentGear((prev) => ({
        ...prev,
        days_used: value,
      }));
    }
  };

  const addGear = () => {
    if (
      currentGear.gear_code === 0 ||
      currentGear.days_used < 1 ||
      currentGear.days_used > 7
    )
      return;

    append(currentGear);
    setCurrentGear({
      gear_code: 0,
      days_used: 1,
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const getGearName = (gear_code: number) => {
    return GEARS.find((g) => g.gear_code === gear_code)?.gear_name || "";
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Effort Last Week</h2>
      <div className="flex flex-col gap-4">
        {/* Gear Selection and Days Used */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Select Gear Used Last Week{required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={currentGear.gear_code}
              onChange={(e) => handleGearChange(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Days Used {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              min={1}
              max={7}
              value={currentGear.days_used}
              onChange={handleDaysChange}
              placeholder="1 to 7"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-6">
            <AddButton
              onClick={addGear}
              disabled={
                currentGear.gear_code === 0 ||
                currentGear.days_used < 1 ||
                currentGear.days_used > 7
              }
            />
          </div>
        </div>

        {/* Display Added Gears */}
        {fields.length > 0 ? (
          <div className="space-y-3">
            {fields.map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-md"
              >
                <span className="font-medium">
                  {getGearName(entry.gear_code)}
                </span>
                <span className="text-gray-600">
                  Used {entry.days_used} day{entry.days_used > 1 ? "s" : ""}{" "}
                  last week
                </span>
                <button
                  onClick={() => handleRemove(index)}
                  className="ml-auto text-red-500 hover:text-red-700"
                  type="button"
                >
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

export default EffortLastWeek;
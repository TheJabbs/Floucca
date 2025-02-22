"use client";

import React, { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "../utils/form-input";
import AddButton from "../utils/form-button";

interface EffortTodayProps {
  required?: boolean;
  onChange: (effortData: EffortTodayData) => void;
}

interface GearSpec {
  name: string;
  type: "number" | "text";
  unit?: string;
}

interface GearEntry {
  gear_code: number;
  gear_details: {
    detail_name: string;
    detail_value: string;
  }[];
}

interface EffortTodayData {
  hours_fished: number;
  gear_entries: GearEntry[];
}

// replace with actual data from the backend
const GEARS = [
  {
    gear_code: 1,
    gear_name: "Fishing Net",
    specs: [
      { name: "Size", type: "number" as "number", unit: "m²" },
      { name: "Mesh Size", type: "number" as "number", unit: "mm" },
    ],
  },
  {
    gear_code: 2,
    gear_name: "Fishing Rod",
    specs: [
      { name: "Length", type: "number" as "number", unit: "m" },
      { name: "Line Weight", type: "number" as "number", unit: "kg" },
    ],
  },
];

const EffortToday: React.FC<EffortTodayProps> = ({
  required = false,
  onChange,
}) => {
  const [currentGearCode, setCurrentGearCode] = useState<number>(0);
  const [currentSpecs, setCurrentSpecs] = useState<Record<string, string>>({});

  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useForm<EffortTodayData>({
    defaultValues: {
      hours_fished: undefined,
      gear_entries: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "gear_entries",
  });

  // Update parent form when fields or hours_fished changes
  const updateParentForm = () => {
    const currentData = {
      hours_fished: getValues('hours_fished'),
      gear_entries: fields
    };
    onChange(currentData);
  };

  useEffect(() => {
    updateParentForm();
  }, [fields.length]); // Only depend on fields.length to prevent too many updates

  const handleGearChange = (gearCode: number) => {
    setCurrentGearCode(Number(gearCode));
    setCurrentSpecs({});
  };

  const handleSpecChange = (specName: string, value: string) => {
    setCurrentSpecs((prev) => ({
      ...prev,
      [specName]: value,
    }));
  };

  const addGear = () => {
    if (currentGearCode === 0) return;

    const selectedGear = GEARS.find((g) => g.gear_code === currentGearCode);
    if (!selectedGear) return;

    // Convert specs to gear details format
    const gearDetails = Object.entries(currentSpecs).map(([name, value]) => ({
      detail_name: name,
      detail_value: value,
    }));

    append({
      gear_code: currentGearCode,
      gear_details: gearDetails,
    });

    // Reset selections
    setCurrentGearCode(0);
    setCurrentSpecs({});
    
    // Update parent form after adding gear
    updateParentForm();
  };

  const handleRemove = (index: number) => {
    remove(index);
    updateParentForm();
  };

  const handleHoursFishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      updateParentForm();
    }
  };

  const getCurrentGearSpecs = (): GearSpec[] => {
    return GEARS.find((g) => g.gear_code === currentGearCode)?.specs || [];
  };

  const getGearName = (gear_code: number) => {
    return GEARS.find((g) => g.gear_code === gear_code)?.gear_name || "";
  };

  const areSpecsComplete = () => {
    const requiredSpecs = getCurrentGearSpecs();
    return requiredSpecs.every((spec) => currentSpecs[spec.name]?.trim());
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Effort Today</h2>

      <div className="mb-6">
        <FormInput
          label="Hours Fished Today"
          name="hours_fished"
          required={required}
          placeholder="Enter hours fished"
          type="number"
          register={register}
          error={errors.hours_fished?.message}
        />
      </div>

      <div className="flex flex-col gap-4">
        {/* Gear Selection and Specs */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Select Gear Used Today
            {required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={currentGearCode}
            onChange={(e) => handleGearChange(Number(e.target.value))}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={fields.length === GEARS.length}
          >
            <option value={0}>Select Gear</option>
            {GEARS.filter(gear => !fields.some(field => field.gear_code === gear.gear_code))
              .map((gear) => (
                <option key={gear.gear_code} value={gear.gear_code}>
                  {gear.gear_name}
                </option>
            ))}
          </select>

          <div className="space-y-3">
            {currentGearCode !== 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 bg-gray-50 rounded-md">
                {getCurrentGearSpecs().map((spec) => (
                  <div key={spec.name} className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      {spec.name}:
                    </label>
                    <div className="flex-1">
                      <input
                        type={spec.type}
                        value={currentSpecs[spec.name] || ""}
                        onChange={(e) =>
                          handleSpecChange(spec.name, e.target.value)
                        }
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter ${spec.name.toLowerCase()}`}
                      />
                    </div>
                    {spec.unit && (
                      <span className="text-sm text-gray-500">{spec.unit}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {currentGearCode !== 0 && (
              <AddButton onClick={addGear} disabled={!areSpecsComplete()} />
            )}
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
                  {entry.gear_details
                    .map(
                      (detail) =>
                        `${detail.detail_name}: ${detail.detail_value}`
                    )
                    .join(", ")}
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

export default EffortToday;
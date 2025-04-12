"use client";

import React, { useState } from "react";
import { useFieldArray, Control, Controller } from "react-hook-form";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import FormField from "@/components/utils/form-field";

interface Gear {
  gear_code: number;
  gear_name: string;
  equipment_id: string;
  equipment_name: string;
}

interface GearDetail {
  detail_name: string;
  detail_value: string;
  equipment_id: string;
}

interface GearEntry {
  id?: string;
  gear_code: number;
  gear_details: GearDetail[];
}

interface EffortTodayProps {
  required?: boolean;
  gears: Gear[];
  control: Control<any>;
}

interface GearSpec {
  equipment_id: string;
  equipment_name: string;
  type: "number" | "text";
  unit?: string;
}

const EffortToday: React.FC<EffortTodayProps> = ({
  required = false,
  gears,
  control,
}) => {
  const [currentGearCode, setCurrentGearCode] = useState<number>(0);
  const [currentSpecs, setCurrentSpecs] = useState<Record<string, string>>({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "effortToday.gear_entries",
  });

  const handleGearChange = (gearCode: number) => {
    setCurrentGearCode(Number(gearCode));
    setCurrentSpecs({}); // Reset specs when gear changes
  };

  const handleSpecChange = (specName: string, value: string) => {
    setCurrentSpecs((prev) => ({
      ...prev,
      [specName]: value,
    }));
  };

  const addGear = () => {
    if (currentGearCode === 0) return;

    const selectedGear = gears.find((g) => g.gear_code === currentGearCode);
    if (!selectedGear) return;

    const gearDetails = Object.entries(currentSpecs).map(([name, value]) => ({
      detail_name: name,
      detail_value: value,
      equipment_id: selectedGear.equipment_id || "",
    }));

    append({
      gear_code: currentGearCode,
      gear_details: gearDetails,
    });

    setCurrentGearCode(0);
    setCurrentSpecs({});
  };

  const getCurrentGearSpecs = (): GearSpec[] => {
    const matchingGears = gears.filter((g) => g.gear_code === currentGearCode);

    if (matchingGears.length === 0) return [];

    return matchingGears.map((gear) => ({
      equipment_id: gear.equipment_id,
      equipment_name: gear.equipment_name,
      type: "number",
    }));
  };

  const getGearName = (gear_code: number) => {
    return gears.find((g) => g.gear_code === gear_code)?.gear_name || "";
  };

  const areSpecsComplete = () => {
    const requiredSpecs = getCurrentGearSpecs();
    return requiredSpecs.every((spec) =>
      currentSpecs[spec.equipment_name]?.trim()
    );
  };

  const availableGears = gears.filter(
    (gear) =>
      !fields.some(
        (field) => (field as unknown as GearEntry).gear_code === gear.gear_code
      )
  );

  const uniqueGearOptions = Array.from(
    new Set(availableGears.map((gear) => gear.gear_code))
  ).map((gearCode) => {
    const gear = availableGears.find((g) => g.gear_code === gearCode);
    return {
      gear_code: gearCode,
      gear_name: gear?.gear_name || "",
    };
  });

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="flex items-center gap-3 text-gray-600">
        <h2 className="text-xl font-semibold">Effort Today</h2>
      </div>

      <div className="space-y-3">
        {/* Hours fished input */}
        <div className="flex items-center gap-2">
          <FormField
            control={control}
            name="effortToday.hours_fished"
            label="Hours Fished Today"
            placeholder="1 to 24 hours"
            type="number"
            min={1}
            max={24}
            required={required}
          />
        </div>

        {/* Gear selection and details */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Fishing Gear Details
            {required && <span className="text-red-500">*</span>}
          </label>

          <div className="space-y-2">
            {/* Gear dropdown */}
            <select
              value={currentGearCode}
              onChange={(e) => handleGearChange(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              disabled={fields.length === gears.length}
            >
              <option value={0}>Select Gear</option>
              {uniqueGearOptions.map((gear) => (
                <option key={gear.gear_code} value={gear.gear_code}>
                  {gear.gear_name}
                </option>
              ))}
            </select>

            {/* Display gear specification inputs when a gear is selected */}
            {currentGearCode !== 0 && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {getCurrentGearSpecs().map((spec) => (
                  <div key={spec.equipment_id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {spec.equipment_id}
                      </span>
                      <label className="block text-sm font-medium text-gray-700">
                        {spec.equipment_name}
                      </label>
                      <input
                        type={spec.type}
                        value={currentSpecs[spec.equipment_name] || ""}
                        onChange={(e) =>
                          handleSpecChange(spec.equipment_name, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e") {
                            e.preventDefault();
                          }
                        }}
                        min={0}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter ${spec.equipment_name.toLowerCase()}`}
                      />
                      <button
                        onClick={addGear}
                        disabled={!areSpecsComplete()}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        type="button"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Gear
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Display added gears */}
        {fields.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700 flex items-center gap-2">
              Added Gear
            </h3>
            <div className="divide-y divide-gray-100 space-y-3">
              {fields.map((field, index) => {
                // Cast field to GearEntry type
                const entry = field as unknown as GearEntry;
                return (
                  <div
                    key={field.id}
                    className="p-4 bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-900">
                          {getGearName(entry.gear_code)}
                        </h4>
                        <div className="text-sm text-gray-600 flex flex-wrap gap-2">
                          {entry.gear_details.map((detail: GearDetail) => (
                            <span
                              key={detail.detail_name}
                              className="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1"
                            >
                              <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                                {detail.equipment_id}
                              </span>
                              <span className="font-medium">
                                {detail.detail_name}:
                              </span>
                              {detail.detail_value}
                            </span>
                          ))}
                        </div>
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
          <div className="text-gray-500 italic text-center py-3 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            No gear added yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default EffortToday;

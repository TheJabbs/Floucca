import React, { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "../utils/form-input";
import { Plus, Trash2, AlertCircle } from "lucide-react";

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

  const updateParentForm = () => {
    const currentData = {
      hours_fished: getValues("hours_fished"),
      gear_entries: fields,
    };
    onChange(currentData);
  };

  useEffect(() => {
    updateParentForm();
  }, [fields.length]);

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

    const gearDetails = Object.entries(currentSpecs).map(([name, value]) => ({
      detail_name: name,
      detail_value: value,
    }));

    append({
      gear_code: currentGearCode,
      gear_details: gearDetails,
    });

    setCurrentGearCode(0);
    setCurrentSpecs({});
    updateParentForm();
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
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="flex items-center gap-3 text-gray-600">
        <h2 className="text-xl font-semibold">Effort Today</h2>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <FormInput
              label="Hours Fished Today"
              name="hours_fished"
              placeholder="Enter hours fished"
              required={required}
              type="number"
              register={register}
              error={errors.hours_fished?.message}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Fishing Gear Details
            {required && <span className="text-red-500">*</span>}
          </label>

          <div className="space-y-2">
            <select
              value={currentGearCode}
              onChange={(e) => handleGearChange(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              disabled={fields.length === GEARS.length}
            >
              <option value={0}>Select Gear</option>
              {GEARS.filter(
                (gear) =>
                  !fields.some((field) => field.gear_code === gear.gear_code)
              ).map((gear) => (
                <option key={gear.gear_code} value={gear.gear_code}>
                  {gear.gear_name}
                </option>
              ))}
            </select>

            {currentGearCode !== 0 && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="grid md:grid-cols-2 gap-4">
                  {getCurrentGearSpecs().map((spec) => (
                    <div key={spec.name} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {spec.name}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type={spec.type}
                          value={currentSpecs[spec.name] || ""}
                          onChange={(e) =>
                            handleSpecChange(spec.name, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Enter ${spec.name.toLowerCase()}`}
                        />
                        {spec.unit && (
                          <span className="text-sm text-gray-500 w-12">
                            {spec.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

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
            )}
          </div>
        </div>

        {fields.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700 flex items-center gap-2">
              Added Gear
            </h3>
            <div className="divide-y divide-gray-100">
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
                      <div className="text-sm text-gray-600">
                        {entry.gear_details
                          .map((detail) => (
                            <span key={detail.detail_name}>
                              {detail.detail_name}: {detail.detail_value}
                            </span>
                          ))
                          .reduce((prev, curr) => (
                            <>
                              {prev} • {curr}
                            </>
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
              ))}
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

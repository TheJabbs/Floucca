import React, { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "../utils/form-input";
import { Plus, Trash2, AlertCircle, Loader } from "lucide-react";
import { getGears } from "../../services/landingService";

interface EffortTodayProps {
  required?: boolean;
  onChange: (effortData: EffortTodayData) => void;
}

interface GearSpec {
  equipment_id: string;
  equipment_name: string;
  type: "number" | "text";
  unit?: string;
}

interface GearEntry {
  gear_code: number;
  gear_details: {
    detail_name: string;
    detail_value: string;
    equipment_id: string; // Added equipment_id
  }[];
}

interface EffortTodayData {
  hours_fished: number;
  gear_entries: GearEntry[];
}

interface Gear {
  gear_code: number;
  gear_name: string;
  equipment_id: string;
  equipment_name: string;
}

const EffortToday: React.FC<EffortTodayProps> = ({
  required = false,
  onChange,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [gears, setGears] = useState<Gear[]>([]);
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

  // Fetch gears from API on component mount
  useEffect(() => {
    const fetchGears = async () => {
      try {
        setLoading(true);
        const gearsData = await getGears();
        setGears(gearsData);
      } catch (error) {
        console.error("Error fetching gears:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGears();
  }, []);

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

    const selectedGear = gears.find((g) => g.gear_code === currentGearCode);
    if (!selectedGear) return;

    const gearDetails = Object.entries(currentSpecs).map(([name, value]) => {
      // Find the corresponding equipment_id for this spec
      const equipmentId = selectedGear.equipment_id || "";

      return {
        detail_name: name,
        detail_value: value,
        equipment_id: equipmentId,
      };
    });

    append({
      gear_code: currentGearCode,
      gear_details: gearDetails,
    });

    setCurrentGearCode(0);
    setCurrentSpecs({});
    updateParentForm();
  };

  const getCurrentGearSpecs = (): GearSpec[] => {
    // Filter gears to find the ones that match the current gear code
    const matchingGears = gears.filter((g) => g.gear_code === currentGearCode);

    if (matchingGears.length === 0) return [];

    // Map to the format needed for input fields
    return matchingGears.map((gear) => ({
      equipment_id: gear.equipment_id,
      equipment_name: gear.equipment_name,
      type: "number", // Default to number, adjust as needed
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

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="flex items-center gap-3 text-gray-600">
        <h2 className="text-xl font-semibold">Effort Today</h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FormInput
            label="Hours Fished Today"
            name="hours_fished"
            placeholder="(1-24 hours)"
            required={required}
            type="number"
            min={1}
            max={24}
            register={register}
            error={errors.hours_fished?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Fishing Gear Details
            {required && <span className="text-red-500">*</span>}
          </label>

          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader className="w-5 h-5 animate-spin text-blue-500 mr-2" />
                <span>Loading gears...</span>
              </div>
            ) : (
              <select
                value={currentGearCode}
                onChange={(e) => handleGearChange(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={fields.length === gears.length}
              >
                <option value={0}>Select Gear</option>
                {/* Group gears by gear_code and display each unique gear only once */}
                {Array.from(new Set(gears.map((gear) => gear.gear_code)))
                  .map((gearCode) => {
                    const gear = gears.find((g) => g.gear_code === gearCode);
                    return {
                      gear_code: gearCode,
                      gear_name: gear?.gear_name || "",
                    };
                  })
                  .filter(
                    (gear) =>
                      !fields.some(
                        (field) => field.gear_code === gear.gear_code
                      )
                  )
                  .map((gear) => (
                    <option key={gear.gear_code} value={gear.gear_code}>
                      {gear.gear_name}
                    </option>
                  ))}
              </select>
            )}

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
                            handleSpecChange(
                              spec.equipment_name,
                              e.target.value
                            )
                          }
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Enter ${spec.equipment_name.toLowerCase()}`}
                          min={0}
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

        {fields.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700 flex items-center gap-2">
              Added Gear
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
                      <div className="text-sm text-gray-600 flex flex-wrap gap-2">
                        {entry.gear_details.map((detail) => (
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

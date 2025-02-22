"use client";

import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "../utils/form-input";
import AddButton from "../utils/form-button";

interface MapLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface FishingDetailsProps {
  required?: boolean;
  todaysGears: GearEntry[];
  selectedLocation: MapLocation | null;
  onChange: (fishingData: FishingDetailsData) => void;
}

interface GearEntry {
  gear_code: number;
  gear_details: any[];
}

interface FishEntry {
  location_id: number;
  gear_code: number;
  specie_code: number;
  fish_weight: number;
  fish_length: number;
  fish_quantity: number;
}

interface FishingDetailsData {
  fish_entries: FishEntry[];
}

interface FormValues {
  current: {
    gear_code: number;
    specie_code: number;
    fish_weight: number;
    fish_length: number;
    fish_quantity: number;
  };
  fish_entries: FishEntry[];
}

// to be changed ya shabeb
const FISH_SPECIES = [
  { specie_code: 1, specie_name: "Tuna" },
  { specie_code: 2, specie_name: "Sardine" },
  { specie_code: 3, specie_name: "Sea Bass" },
  { specie_code: 4, specie_name: "Mackerel" },
];

const FishingDetails: React.FC<FishingDetailsProps> = ({
  required = false,
  todaysGears,
  selectedLocation,
  onChange,
}) => {
  const {
    register,
    control,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      current: {
        gear_code: undefined,
        specie_code: undefined,
        fish_weight: undefined,
        fish_length: undefined,
        fish_quantity: undefined,
      },
      fish_entries: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fish_entries",
  });

  const currentValues = watch("current");

  useEffect(() => {
    onChange({ fish_entries: fields });
  }, [fields, onChange]);

  const addFishEntry = () => {
    const values = getValues("current");

    if (!isEntryValid(values) || !selectedLocation) return;

    append({
      location_id: selectedLocation.id,
      gear_code: Number(values.gear_code),
      specie_code: Number(values.specie_code),
      fish_weight: Number(values.fish_weight),
      fish_length: Number(values.fish_length),
      fish_quantity: Number(values.fish_quantity),
    });

    // Reset only the fish details, keep gear
    reset({
      current: {
        ...values,
        specie_code: undefined,
        fish_weight: undefined,
        fish_length: undefined,
        fish_quantity: undefined,
      },
      fish_entries: getValues("fish_entries"),
    });
  };

  const isEntryValid = (values: FormValues["current"]) => {
    return (
      selectedLocation &&
      values.gear_code &&
      values.specie_code &&
      values.fish_weight &&
      values.fish_length &&
      values.fish_quantity
    );
  };

  const getGearName = (code: number) => {
    const gear = todaysGears.find((g) => g.gear_code === code);
    return gear ? `Gear ${gear.gear_code}` : "";
  };

  const getSpecieName = (code: number) =>
    FISH_SPECIES.find((species) => species.specie_code === code)?.specie_name ||
    "";

  if (!selectedLocation) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Fishing Details Today</h2>
        <p className="text-gray-500 italic">Please select a location on the map first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Fishing Details Today</h2>
      
      <div className="bg-blue-50 p-3 rounded-md mb-4">
        <p className="text-sm text-blue-800">
          {selectedLocation.name} (Lat: {selectedLocation.lat.toFixed(4)}, Lng: {selectedLocation.lng.toFixed(4)})
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Gear Selection */}
        <div className="form-group">
          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Fishing Gear {required && <span className="text-red-500">*</span>}
          </label>
          <select
            {...register("current.gear_code")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gear</option>
            {todaysGears.map((gear) => (
              <option key={gear.gear_code} value={gear.gear_code}>
                {getGearName(gear.gear_code)}
              </option>
            ))}
          </select>
        </div>

        {/* Fish Species Selection */}
        <div className="form-group">
          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Fish Species {required && <span className="text-red-500">*</span>}
          </label>
          <select
            {...register("current.specie_code")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Species</option>
            {FISH_SPECIES.map((species) => (
              <option key={species.specie_code} value={species.specie_code}>
                {species.specie_name}
              </option>
            ))}
          </select>
        </div>

        {/* Fish Measurements */}
        <div className="grid grid-cols-3 gap-3">
          <FormInput
            label="Weight"
            name="current.fish_weight"
            placeholder="(kg)"
            type="number"
            required={required}
            register={register}
            error={errors.current?.fish_weight?.message}
          />

          <FormInput
            label="Length"
            name="current.fish_length"
            placeholder="(cm)"
            type="number"
            required={required}
            register={register}
            error={errors.current?.fish_length?.message}
          />

          <FormInput
            label="Quantity"
            name="current.fish_quantity"
            placeholder="No. fish"
            type="number"
            required={required}
            register={register}
            error={errors.current?.fish_quantity?.message}
          />
        </div>

        <div className="flex">
          <AddButton
            onClick={addFishEntry}
            disabled={!isEntryValid(currentValues)}
          >
            + Add
          </AddButton>
        </div>
      </div>

      {/* Display Added Fish Entries */}
      {fields.length > 0 ? (
        <div className="space-y-3 mt-6">
          {fields.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-md"
            >
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Gear:</span>{" "}
                  {getGearName(entry.gear_code)}
                </div>
                <div>
                  <span className="font-medium">Species:</span>{" "}
                  {getSpecieName(entry.specie_code)}
                </div>
                <div>
                  <span className="font-medium">Details:</span>{" "}
                  {entry.fish_weight}kg, {entry.fish_length}cm, Qty:{" "}
                  {entry.fish_quantity}
                </div>
              </div>
              <button
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700"
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No fish entries added yet.</p>
      )}
    </div>
  );
};

export default FishingDetails;
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "../utils/form-input";
import { Trash2, Plus, Search, X } from "lucide-react";
import { getSpecies } from "@/services/landingService";

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

interface Species {
  specie_code: number;
  specie_name: string;
}

const FishingDetails: React.FC<FishingDetailsProps> = ({
  required = false,
  todaysGears,
  selectedLocation,
  onChange,
}) => {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  const {
    register,
    control,
    watch,
    reset,
    getValues,
    setValue,
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

  // Fetch species from API when component mounts
  useEffect(() => {
    const fetchSpeciesData = async () => {
      try {
        try {
          const data = await getSpecies();
          setSpeciesList(data);
        } catch (error) {
          console.error("Error fetching species:", error);
        }
      } catch (error) {
        console.error("Error in fetchSpeciesData:", error);
      }
    };

    fetchSpeciesData();
  }, []);

  useEffect(() => {
    onChange({ fish_entries: fields });
  }, [fields, onChange]);

  const filteredSpecies = speciesList.filter((s) =>
    s.specie_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

    // Reset form fields after adding
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
    setSelectedSpecies(null);
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

  const handleSpeciesSelect = (species: Species) => {
    setValue("current.specie_code", Number(species.specie_code));
    setSelectedSpecies(species);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const getGearName = (code: number) => {
    const gear = todaysGears.find((g) => g.gear_code === code);
    return gear ? `Gear ${gear.gear_code}` : "";
  };

  const getSpecieName = (code: number) => {
    const species = speciesList.find((s) => s.specie_code === code);
    return species ? species.specie_name : `Species ${code}`;
  };

  if (!selectedLocation) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 text-gray-600">
          <h2 className="text-xl font-semibold">Fishing Details Today</h2>
        </div>
        <p className="mt-4 text-gray-500 italic flex items-center gap-2">
          Please select a location on the map first.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center gap-3 text-gray-600">
        <h2 className="text-xl font-semibold">Fishing Details Today</h2>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 text-blue-800">
          <span className="font-medium">{selectedLocation.name}</span>
          <span className="text-blue-600">
            ({selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)})
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Fishing Gear {required && <span className="text-red-500">*</span>}
            </label>
            <select
              {...register("current.gear_code")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select Gear</option>
              {todaysGears.map((gear) => (
                <option key={gear.gear_code} value={gear.gear_code}>
                  {getGearName(gear.gear_code)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Fish Species {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <div 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex items-center justify-between cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedSpecies ? (
                  <div className="flex items-center justify-between w-full">
                    <span>{selectedSpecies.specie_name}</span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpecies(null);
                        setValue("current.specie_code", 0); // Use 0 instead of undefined
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500">Search for species...</span>
                )}
              </div>
              
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="sticky top-0 bg-white p-2 border-b">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search species..."
                        className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
                    </div>
                  </div>
                  
                  {filteredSpecies.length === 0 ? (
                    <div className="p-3 text-center text-gray-500">No species found</div>
                  ) : (
                    filteredSpecies.map((species) => (
                      <div
                        key={species.specie_code}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleSpeciesSelect(species)}
                      >
                        {species.specie_name}
                      </div>
                    ))
                  )}
                </div>
              )}
              
              <input
                type="hidden"
                {...register("current.specie_code")}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <FormInput
              label="Weight (kg)"
              name="current.fish_weight"
              type="number"
              required={required}
              register={register}
              error={errors.current?.fish_weight?.message}
            />
          </div>

          <div className="space-y-1">
            <FormInput
              label="Length (cm)"
              name="current.fish_length"
              type="number"
              required={required}
              register={register}
              error={errors.current?.fish_length?.message}
            />
          </div>

          <div className="space-y-1">
            <FormInput
              label="Quantity"
              name="current.fish_quantity"
              type="number"
              required={required}
              register={register}
              error={errors.current?.fish_quantity?.message}
            />
          </div>
        </div>

        <button
          onClick={addFishEntry}
          disabled={!isEntryValid(currentValues)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </button>
      </div>

      {fields.length > 0 ? (
        <div className="space-y-4 mt-6">
          <h3 className="font-medium text-gray-700">Added Entries</h3>
          <div className="divide-y divide-gray-100">
            {fields.map((entry, index) => (
              <div
                key={entry.id}
                className="p-4 bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">
                        {getSpecieName(entry.specie_code)}
                      </span>
                    </div>
                    <span className="text-gray-600">
                      {entry.fish_weight}kg, {entry.fish_quantity} fish
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{entry.fish_length}cm</span>
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
        <div className="text-gray-500 italic text-center py-1">
          No fish entries added yet.
        </div>
      )}
    </div>
  );
};

export default FishingDetails;
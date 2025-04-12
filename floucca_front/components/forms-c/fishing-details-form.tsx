"use client";

import React, { useState, useEffect } from "react";
import { useFieldArray, Control, useWatch } from "react-hook-form";
import { Trash2, Plus, Search, X } from "lucide-react";

interface Gear {
  gear_code: number;
  gear_name: string;
  equipment_id: string;
  equipment_name: string;
}

interface Species {
  specie_code: number;
  specie_name: string;
}

// Define the type of gear entries from EffortToday
interface GearEntry {
  id?: string;
  gear_code: number;
  gear_details: {
    detail_name: string;
    detail_value: string;
    equipment_id: string;
  }[];
}

// Define the type of fish entries
interface FishEntry {
  id?: string;
  location_id: number;
  gear_code: number;
  specie_code: number;
  fish_weight: number;
  fish_length: number;
  fish_quantity: number;
  price: number;
}

interface FishingDetailsProps {
  required?: boolean;
  control: Control<any>;
  gears: Gear[];
  species: Species[];
}

const FishingDetails: React.FC<FishingDetailsProps> = ({
  required = false,
  control,
  gears,
  species,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  
  // Current entry state for adding new fish
  const [currentEntry, setCurrentEntry] = useState<{
    gear_code: number;
    specie_code: number;
    fish_weight: number;
    fish_length: number;
    fish_quantity: number;
    price: number;
  }>({
    gear_code: 0,
    specie_code: 0,
    fish_weight: 0,
    fish_length: 0,
    fish_quantity: 0,
    price: 0,
  });

  // Get relevant data from form state
  const location = useWatch({ control, name: "location" });
  const todaysGears = useWatch({ control, name: "effortToday.gear_entries" }) || [];

  // Set up field array for fish entries
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fishingDetails.fish_entries",
  });

  // Handle species selection from dropdown
  const handleSpeciesSelect = (species: Species) => {
    setCurrentEntry(prev => ({
      ...prev,
      specie_code: species.specie_code
    }));
    setSelectedSpecies(species);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  // Update current entry field
  const updateCurrentEntry = (field: string, value: any) => {
    setCurrentEntry(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Check if current entry is valid before adding
  const isEntryValid = () => {
    const { gear_code, specie_code, fish_weight, fish_length, fish_quantity, price } = currentEntry;
    return (
      gear_code > 0 &&
      specie_code > 0 &&
      fish_weight > 0 &&
      fish_length > 0 &&
      fish_quantity > 0 &&
      price > 0
    );
  };

  // Add new fish entry
  const addFishEntry = () => {
    if (!location || !isEntryValid()) return;

    append({
      location_id: location.id,
      ...currentEntry
    });

    // Reset current entry
    setCurrentEntry({
      gear_code: 0,
      specie_code: 0,
      fish_weight: 0,
      fish_length: 0,
      fish_quantity: 0,
      price: 0,
    });
    setSelectedSpecies(null);
  };

  // Helper functions to get names
  const getGearName = (code: number) => {
    const gearFromList = gears.find((g: Gear) => g.gear_code === code);
    if (gearFromList) return gearFromList.gear_name;
    
    const gear = todaysGears.find((g: GearEntry) => g.gear_code === code);
    if (gear) return `Gear ${gear.gear_code}`;
    
    return `Unknown Gear (${code})`;
  };

  const getSpecieName = (code: number) => {
    const speciesItem = species.find((s) => s.specie_code === code);
    return speciesItem ? speciesItem.specie_name : `Species ${code}`;
  };

  // Filtered species for dropdown
  const filteredSpecies = species.filter(s => 
    s.specie_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const targetElement = event.target as HTMLElement;
      if (!targetElement.closest('.species-dropdown')) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const preventNegativeAndE = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e") {
      e.preventDefault();
    }
  };

  
  // If no location is selected, show a message
  if (!location) {
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
        <h2 className="text-xl font-semibold">
          Fishing Details Today
          {required && <span className="text-red-500">*</span>}
        </h2>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 text-blue-800">
          <span className="font-medium">{location.name}</span>
          <span className="text-blue-600">
            ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Gear selection */}
          <div className="form-group">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Fishing Gear {required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={currentEntry.gear_code}
              onChange={(e) => updateCurrentEntry('gear_code', Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value={0}>Select Gear</option>
              {todaysGears.map((gear: GearEntry) => (
                <option key={gear.gear_code} value={gear.gear_code}>
                  {getGearName(gear.gear_code)}
                </option>
              ))}
            </select>
          </div>

          {/* Species selection with search dropdown */}
          <div className="form-group species-dropdown">
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
                        updateCurrentEntry('specie_code', 0);
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSpeciesSelect(species);
                        }}
                      >
                        {species.specie_name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fish details inputs */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Total Weight (kg) {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              value={currentEntry.fish_weight || ''}
              onChange={(e) => updateCurrentEntry('fish_weight', Number(e.target.value))}
              min={0}
              onInput={(e) => {
                const input = e.currentTarget;
                if (parseFloat(input.value) < 0) {
                  input.value = "0";
                }
              }}    
              onKeyDown={preventNegativeAndE}          
              placeholder="Fish weight"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Length (cm) {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              value={currentEntry.fish_length || ''}
              onInput={(e) => {
                const input = e.currentTarget;
                if (parseFloat(input.value) < 0) {
                  input.value = "0";
                }
              }}
              onChange={(e) => updateCurrentEntry('fish_length', Number(e.target.value))}
              onKeyDown={preventNegativeAndE}
              min={0}
              placeholder="Fish length"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Quantity (per kg) {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              value={currentEntry.fish_quantity || ''}
              onInput={(e) => {
                const input = e.currentTarget;
                if (parseFloat(input.value) < 1) {
                  input.value = "1";
                }
              }}  
              onChange={(e) => updateCurrentEntry('fish_quantity', Number(e.target.value))}
              onKeyDown={preventNegativeAndE}
              min={1}            
              placeholder="Fish quantity"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Price (LBP per kg) {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              value={currentEntry.price || ''}
              onChange={(e) => updateCurrentEntry('price', Number(e.target.value))}
              min={0}
              onInput={(e) => {
                const input = e.currentTarget;
                if (parseFloat(input.value) < 0) {
                  input.value = "0";
                }
              }}              
              onKeyDown={preventNegativeAndE}
              placeholder="Enter price"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={addFishEntry}
          disabled={!isEntryValid()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </button>
      </div>

      {/* Display added fish entries */}
      {fields.length > 0 ? (
        <div className="space-y-4 mt-6">
          <h3 className="font-medium text-gray-700">Added Entries</h3>
          <div className="divide-y divide-gray-100 space-y-3">
            {fields.map((field, index) => {
              // Cast to FishEntry type
              const entry = field as unknown as FishEntry;
              return (
                <div
                  key={field.id}
                  className="p-4 bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-2 md:grid-cols-5 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-900 ">
                          {getSpecieName(entry.specie_code)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600 ">
                          {getGearName(entry.gear_code)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600 truncate">
                          {entry.fish_weight}kg, {entry.fish_quantity} fish
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600 truncate">{entry.fish_length}cm</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600 truncate">{entry.price} LBP</span>
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
        <div className="text-gray-500 italic text-center py-1">
          No fish entries added yet.
        </div>
      )}
    </div>
  );
};

export default FishingDetails;
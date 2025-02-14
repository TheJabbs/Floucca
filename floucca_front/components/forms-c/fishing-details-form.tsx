'use client'

import React, { useState, useEffect } from 'react';
import AddButton from '../utils/form-button';

interface FishEntry {
  locationId: string;
  gearId: number;
  specieId: number;
  weight: number;
  length: number;
  quantity: number;
}

interface Location {
  id: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface FishingDetailsProps {
  selectedLocations: Location[]; //coordinates from map
  selectedGears: { gearId: number; gearName: string }[]; //gear from effort today
  onChange: (entries: FishEntry[]) => void;
}

const FishingDetails: React.FC<FishingDetailsProps> = ({
  selectedLocations,
  selectedGears,
  onChange
}) => {
  const [fishEntries, setFishEntries] = useState<FishEntry[]>([]);
  const [availableSpecies, setAvailableSpecies] = useState<{ specie_code: number; specie_name: string }[]>([]);
  const [currentEntry, setCurrentEntry] = useState<FishEntry>({
    locationId: '',
    gearId: 0,
    specieId: 0,
    weight: 0,
    length: 0,
    quantity: 0
  });

  useEffect(() => {
    // Fetch species from API
    const fetchSpecies = async () => {
      try {
        // replace with API call
        const sampleSpecies = [
          { specie_code: 1, specie_name: "Tuna" },
          { specie_code: 2, specie_name: "Sardine" },
          { specie_code: 3, specie_name: "Sea Bass" },
        ];
        setAvailableSpecies(sampleSpecies);
      } catch (error) {
        console.error('Error fetching species:', error);
      }
    };

    fetchSpecies();
  }, []);

  useEffect(() => {
    onChange(fishEntries);
  }, [fishEntries, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentEntry(prev => ({
      ...prev,
      [name]: name === 'locationId' || name === 'gearId' || name === 'specieId' 
        ? value 
        : Number(value)
    }));
  };

  const isValidEntry = () => {
    return (
      currentEntry.locationId !== '' &&
      currentEntry.gearId !== 0 &&
      currentEntry.specieId !== 0 &&
      currentEntry.weight > 0 &&
      currentEntry.length > 0 &&
      currentEntry.quantity > 0
    );
  };

  const addFishEntry = () => {
    if (!isValidEntry()) return;
    
    setFishEntries(prev => [...prev, currentEntry]);
    setCurrentEntry({
      locationId: '',
      gearId: 0,
      specieId: 0,
      weight: 0,
      length: 0,
      quantity: 0
    });
  };

  const removeFishEntry = (index: number) => {
    setFishEntries(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Today's Fishing Details</h2>
      
      {/* Location and Gear Selection Row */}
      <div className="flex gap-4">
        <select
          name="locationId"
          value={currentEntry.locationId}
          onChange={handleInputChange}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Location</option>
          {selectedLocations.map(location => (
            <option key={location.id} value={location.id}>
              {`Lat: ${location.coordinates.lat.toFixed(4)}, Lng: ${location.coordinates.lng.toFixed(4)}`}
            </option>
          ))}
        </select>

        <select
          name="gearId"
          value={currentEntry.gearId}
          onChange={handleInputChange}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={0}>Select Gear Used</option>
          {selectedGears.map(gear => (
            <option key={gear.gearId} value={gear.gearId}>
              {gear.gearName}
            </option>
          ))}
        </select>
      </div>

      {/* Fish Details Section */}
      <div className="space-y-4">
        <h3 className="font-medium">Fish Details</h3>
        
        <select
          name="specieId"
          value={currentEntry.specieId}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={0}>Select Species</option>
          {availableSpecies.map(species => (
            <option key={species.specie_code} value={species.specie_code}>
              {species.specie_name}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <input
            type="number"
            name="weight"
            placeholder="Weight (Kg)"
            value={currentEntry.weight || ''}
            onChange={handleInputChange}
            min={0}
            step="0.1"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="number"
            name="length"
            placeholder="Length(cm)"
            value={currentEntry.length || ''}
            onChange={handleInputChange}
            min={0}
            step="0.1"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={currentEntry.quantity || ''}
            onChange={handleInputChange}
            min={1}
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <AddButton 
          onClick={addFishEntry}
          disabled={!isValidEntry()}
        />
      </div>

      {/* Display added entries */}
      <div className="space-y-3">
        {fishEntries.map((entry, index) => (
          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
            <span className="font-medium">
              {availableSpecies.find(s => s.specie_code === Number(entry.specieId))?.specie_name}
            </span>
            <span className="text-gray-600">
              Weight: {entry.weight}kg, Length: {entry.length}cm, Quantity: {entry.quantity}
            </span>
            <button
              type="button"
              onClick={() => removeFishEntry(index)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FishingDetails;
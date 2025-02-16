'use client';

import React, { useState, useEffect } from 'react';
import AddButton from '../utils/form-button';

interface FishEntry {
  locationId: string;
  gear_code: number;
  specie_code: number;
  fish_weight: number;
  fish_length: number;
  fish_quantity: number;
}

interface Location {
  id: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface GearUsed {
  gear_code: number;
  specs?: string;
}

interface Species {
  specie_code: number;
  specie_name: string;
}

interface FishingDetailsProps {
  selectedLocations: Location[];
  usedGears: GearUsed[]; // ⬅️ Selected gears from EffortTodayForm
  onChange: (entries: FishEntry[]) => void;
}

const FishingDetails: React.FC<FishingDetailsProps> = ({
  selectedLocations,
  usedGears = [],
  onChange
}) => {
  const [fishEntries, setFishEntries] = useState<FishEntry[]>([]);
  const [availableSpecies, setAvailableSpecies] = useState<Species[]>([]);
  const [currentEntry, setCurrentEntry] = useState<FishEntry>({
    locationId: '',
    gear_code: 0,
    specie_code: 0,
    fish_weight: 0,
    fish_length: 0,
    fish_quantity: 0
  });

  useEffect(() => {
    // TODO: Replace with API call
    const fetchSpecies = async () => {
      try {
        const sampleSpecies = [
          { specie_code: 1, specie_name: 'Tuna' },
          { specie_code: 2, specie_name: 'Sardine' },
          { specie_code: 3, specie_name: 'Sea Bass' },
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
      [name]: name === 'locationId' || name === 'gear_code' || name === 'specie_code'
        ? value
        : Number(value)
    }));
  };

  const addFishEntry = () => {
    if (!currentEntry.locationId || !currentEntry.gear_code || !currentEntry.specie_code) return;

    setFishEntries(prev => [...prev, currentEntry]);
    setCurrentEntry({
      locationId: '',
      gear_code: 0,
      specie_code: 0,
      fish_weight: 0,
      fish_length: 0,
      fish_quantity: 0
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Today's Fishing Details</h2>

      <div className="flex gap-4">
        {/* Location Selection */}
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

        {/* Gear Selection from Effort Today */}
        <select
          name="gear_code"
          value={currentEntry.gear_code}
          onChange={handleInputChange}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={0}>Select Gear Used</option>
          {usedGears.map(gear => (
            <option key={gear.gear_code} value={gear.gear_code}>
              {gear.specs ? `${gear.gear_code} (${gear.specs})` : `Gear ${gear.gear_code}`}
            </option>
          ))}
        </select>
      </div>

      {/* Fish Details */}
      <div className="space-y-4">
        <select
          name="specie_code"
          value={currentEntry.specie_code}
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

        <AddButton onClick={addFishEntry} />
      </div>
    </div>
  );
};

export default FishingDetails;

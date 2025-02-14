'use client'

import React, { useState } from 'react';
import FishingDetails from "@/components/forms-c/fishing-details-form";

interface Location {
  id: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface FishEntry {
  locationId: string;
  gearId: number;
  specieId: number;
  weight: number;
  length: number;
  quantity: number;
}

interface Gear {
  gearId: number;
  gearName: string;
}

function Page() {
  // populated by  map component 
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([
    { id: '1', coordinates: { lat: 34.123, lng: 35.456 } },
    { id: '2', coordinates: { lat: 34.234, lng: 35.567 } },
  ]);

  // populated by effort today component 
  const [selectedGears, setSelectedGears] = useState<Gear[]>([
    { gearId: 1, gearName: "Trawl Net" },
    { gearId: 2, gearName: "Gill Net" },
  ]);

  // state for fish entries
  const [fishData, setFishData] = useState<FishEntry[]>([]);

  const handleFishChange = (entries: FishEntry[]) => {
    setFishData(entries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (fishData.length === 0) {
      alert('Please add at least one fish entry');
      return;
    }

    // Prepare the form data for submission
    const formData = {
      // Other form sections to be added later
      fishingDetails: fishData,
    };

    console.log('Submitting form data:', formData);

    // API call will go here
    // fetch('/api/landings', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formData),
    // });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Landing Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Other form components will be added here */}
        {/* <BoatDetails /> */}
        {/* <EffortToday /> */}
        {/* <EffortLastWeek /> */}
        {/* <MapComponent /> */}
        
        <FishingDetails
          selectedLocations={selectedLocations}
          selectedGears={selectedGears}
          onChange={handleFishChange}
        />

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Page;
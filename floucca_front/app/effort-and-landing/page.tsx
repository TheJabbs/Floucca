'use client';

import React, { useState } from 'react';
import FishingDetails from "@/components/forms-c/fishing-details-form";
import EffortTodayForm from "@/components/forms-c/effort-today-form";
import BoatInfo from "@/components/forms-c/boat-form"; 
import EffortLastWeek from "@/components/forms-c/effort-last-week-form"; // ✅ Import EffortLastWeek

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

interface EffortToday {
  hoursFished: number;
  gearUsed: Gear[];
}

interface BoatData {
  ownerName: string;
  registrationNumber: string;
  boatName: string;
  horsePower: number;
  length: number;
  capacity: number;
}

interface EffortLastWeekEntry {
  gearId: number;
  timesUsed: number;
}

function Page() {
  // populated by map component
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([
    { id: '1', coordinates: { lat: 34.123, lng: 35.456 } },
    { id: '2', coordinates: { lat: 34.234, lng: 35.567 } },
  ]);

  // Store Boat Details
  const [boatData, setBoatData] = useState<BoatData>({
    ownerName: '',
    registrationNumber: '',
    boatName: '',
    horsePower: 0,
    length: 0,
    capacity: 0,
  });

  // Store effort today (hours fished & gear used)
  const [effortToday, setEffortToday] = useState<EffortToday>({
    hoursFished: 0,
    gearUsed: [],
  });

  // Store fish data
  const [fishData, setFishData] = useState<FishEntry[]>([]);

  // Store effort last week (gears & times used)
  const [effortLastWeek, setEffortLastWeek] = useState<EffortLastWeekEntry[]>([]);

  // Update Boat Details
  const handleBoatChange = (boatDetails: BoatData) => {
    setBoatData(boatDetails);
  };

  // Update effort today (hours fished & selected gear)
  const handleEffortChange = (effort: EffortToday) => {
    setEffortToday(effort);
  };

  // Update fish data
  const handleFishChange = (entries: FishEntry[]) => {
    setFishData(entries);
  };

  // Update effort last week data
  const handleEffortLastWeekChange = (entries: EffortLastWeekEntry[]) => {
    setEffortLastWeek(entries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (fishData.length === 0) {
      alert('Please add at least one fish entry');
      return;
    }

    // Prepare the form data for submission
    const formData = {
      boatData,   
      effortToday,
      effortLastWeek,  // ✅ Now includes effort last week!
      fishingDetails: fishData,
    };

    console.log('Submitting form data:', formData);

    // API call will go here
    // fetch('/api/landings', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Landing Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ✅ Boat Information Form */}
        <BoatInfo onChange={handleBoatChange} />

        {/* ✅ Effort Today Form */}
        <EffortTodayForm availableGears={effortToday.gearUsed} onChange={handleEffortChange} />

        {/* ✅ Effort Last Week Form */}
        <EffortLastWeek onChange={handleEffortLastWeekChange} />

        {/* <MapComponent /> */}

        <FishingDetails
          selectedLocations={selectedLocations}
          selectedGears={effortToday.gearUsed}
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

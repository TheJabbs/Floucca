"use client";

import React, { useState, useCallback } from "react";
import BoatInfo from "@/components/forms-c/boat-form";
import FishingDetails from "@/components/forms-c/fishing-details-form";
import EffortTodayForm from "@/components/forms-c/effort-today-form";
import EffortLastWeek from "@/components/forms-c/effort-last-week-form"; // ✅ Import EffortLastWeek
import dynamic from "next/dynamic";
// Dynamically import MapWithMarkers with no SSR
const MapWithMarkers = dynamic(
  () => import("@/components/forms-c/map-with-markers"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        Loading map...
      </div>
    ),
  }
);

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
  fleet_owner: string;
  fleet_registration: number;
  fleet_size: number;
  fleet_crew: number;
  fleet_max_weight: number;
  fleet_length: number;
}

interface EffortLastWeekEntry {
  gearId: number;
  timesUsed: number;
}

function Page() {
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);

  const [selectedGears] = useState<Gear[]>([
    { gearId: 1, gearName: "Trawl Net" },
    { gearId: 2, gearName: "Gill Net" },
  ]);

  const [fishData, setFishData] = useState<FishEntry[]>([]);

  // Store Boat Details
  const [boatData, setBoatData] = useState<BoatData>({
    fleet_owner: "",
    fleet_registration: 0,
    fleet_size: 0,
    fleet_crew: 0,
    fleet_max_weight: 0,
    fleet_length: 0,
  });

  const handleMarkersUpdate = useCallback(
    (markers: { id: number; lat: number; lng: number }[]) => {
      const locations = markers.map((marker) => ({
        id: marker.id.toString(),
        coordinates: {
          lat: marker.lat,
          lng: marker.lng,
        },
      }));
      setSelectedLocations(locations);
    },
    []
  );

  // Store effort today (hours fished & gear used)
  const [effortToday, setEffortToday] = useState<EffortToday>({
    hoursFished: 0,
    gearUsed: [],
  });

  // Store effort last week (gears & times used)
  const [effortLastWeek, setEffortLastWeek] = useState<EffortLastWeekEntry[]>(
    []
  );

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
      alert("Please add at least one fish entry");
      return;
    }

    if (selectedLocations.length === 0) {
      alert("Please select at least one fishing location on the map");
      return;
    }

    const formData = {
      locationDetails: selectedLocations,
      boatData,
      effortToday,
      effortLastWeek,
      fishingDetails: fishData,
    };

    console.log("Submitting form data:", formData);

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

        <BoatInfo onChange={handleBoatChange} />
        <EffortTodayForm
          availableGears={effortToday.gearUsed}
          onChange={handleEffortChange}
        />
        <EffortLastWeek onChange={handleEffortLastWeekChange} />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select Fishing Locations</h2>
          <p className="text-sm text-gray-600">
            Click on the map to add fishing locations. Click a marker to remove
            it.
          </p>
          <div className="h-[500px] w-full border rounded-lg overflow-hidden">
            <MapWithMarkers onMarkersChange={handleMarkersUpdate} />
          </div>
        </div>

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

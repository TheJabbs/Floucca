"use client";
import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import BoatInfo from "@/components/forms-c/boat-form";
import EffortToday from "@/components/forms-c/effort-today-form";
import EffortLastWeek from "@/components/forms-c/effort-last-week-form";
const MapWithMarkers = dynamic(
  () => import("@/components/forms-c/map-with-markers"),
  { ssr: false }
);
import FishingDetails from "@/components/forms-c/fishing-details-form";
import SubmitButton from "@/components/utils/submit-button";
import PortDropdown from "@/components/forms-c/port-dropdown"; 


// Form interfaces
interface BoatData {
  fleet_owner: string;
  fleet_registration: number;
  fleet_size: number;
  fleet_crew: number;
  fleet_max_weight: number;
  fleet_length: number;
}

interface EffortTodayData {
  hours_fished: number;
  gear_entries: {
    gear_code: number;
    gear_details: {
      detail_name: string;
      detail_value: string;
    }[];
  }[];
}

interface EffortLastWeekData {
  gear_entries: {
    gear_code: number;
    days_used: number;
  }[];
}

interface MapLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface FishingDetailsData {
  fish_entries: {
    location_id: number;
    gear_code: number;
    specie_code: number;
    fish_weight: number;
    fish_length: number;
    fish_quantity: number;
  }[];
}

interface LandingsForm {
  LandingFormDTO: {
    port: string; 
    boatData: BoatData;
    effortTodayData: EffortTodayData;
    effortLastWeekData: EffortLastWeekData;
    location: MapLocation | null;
    fishingDetails: FishingDetailsData;
  };
}

function Page() {
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<LandingsForm>({
    defaultValues: {
      LandingFormDTO: {
        port: "",
        boatData: {
          fleet_owner: "",
          fleet_registration: 0,
          fleet_size: 0,
          fleet_crew: 0,
          fleet_max_weight: 0,
          fleet_length: 0,
        },
        effortTodayData: {
          hours_fished: 0,
          gear_entries: [],
        },
        effortLastWeekData: {
          gear_entries: [],
        },
        location: null,
        fishingDetails: {
          fish_entries: [],
        },
      },
    },
  });

  const [selectedPort, setSelectedPort] = useState<string>("");

  // Track dependencies for FishingDetails
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [selectedGears, setSelectedGears] = useState<{
    gear_code: number;
    gear_details: { detail_name: string; detail_value: string }[];
  }[]>([]);
  const [isValid, setIsValid] = useState(false);

  // Handlers
  const handleBoatInfoChange = useCallback((data: BoatData) => {
    setValue("LandingFormDTO.boatData", data);
    setIsValid(!!data.fleet_owner && Object.values(data).every(val => val != null));
  }, [setValue]);

  const handleEffortTodayChange = useCallback((data: EffortTodayData) => {
    setValue("LandingFormDTO.effortTodayData", data);
    setSelectedGears(data.gear_entries);
    setIsValid(data.hours_fished != null && data.gear_entries.length > 0);
  }, [setValue]);

  const handleEffortLastWeekChange = useCallback((data: EffortLastWeekData) => {
    setValue("LandingFormDTO.effortLastWeekData", data);
    setIsValid(data.gear_entries.length > 0);
  }, [setValue]);

  const handleLocationsChange = useCallback((data: MapLocation|null) => {
    setValue("LandingFormDTO.location", data);
    setSelectedLocation(data);
    setIsValid(!!data);
  }, [setValue]);

  const handleFishingDetailsChange = useCallback((data: FishingDetailsData) => {
    setValue("LandingFormDTO.fishingDetails", data);
  }, [setValue]);

  const handlePortChange = (portId: string) => {
    setSelectedPort(portId);
    setValue("LandingFormDTO.port", portId); 
  };

  const onSubmit = async (formData: LandingsForm) => {
    console.log("Submitting form data:", formData);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Landing Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PortDropdown selectedPort={selectedPort} onPortChange={handlePortChange} />
        <BoatInfo
          required={true}
          onChange={handleBoatInfoChange}
        />
        <EffortToday
          required={true}
          onChange={handleEffortTodayChange}
        />
        <EffortLastWeek
          required={true}
          onChange={handleEffortLastWeekChange}
        />
        <MapWithMarkers
          required={true}
          onChange={handleLocationsChange}
        />
        <FishingDetails
          required={true}
          todaysGears={selectedGears}
          onChange={handleFishingDetailsChange}
        />

        <SubmitButton
          isSubmitting={isSubmitting}
          disabled={!isValid}
          label="Submit"
        />
      </form>
    </div>
  );
}

export default Page;
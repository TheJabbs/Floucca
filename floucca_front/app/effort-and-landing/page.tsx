"use client";
import React, { useEffect, useCallback, useState } from "react";
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
import { usePort } from "@/contexts/PortContext";
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

interface FormValidation {
  port: boolean;
  boatInfo: boolean;
  effortToday: boolean | null; 
  effortLastWeek: boolean | null; 
  location: boolean | null; 
  fishingDetails: boolean | null;
}

function Page() {
  const {selectedPort} = usePort();
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<LandingsForm>({
    defaultValues: {
      LandingFormDTO: {
        port: selectedPort,
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

  // Track dependencies for FishingDetails
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [selectedGears, setSelectedGears] = useState<{
    gear_code: number;
    gear_details: { detail_name: string; detail_value: string }[];
  }[]>([]);
  
  // Track if effort sections are actively being completed
  const [hasEffortToday, setHasEffortToday] = useState<boolean>(false);
  const [hasEffortLastWeek, setHasEffortLastWeek] = useState<boolean>(false);

  const [formValidation, setFormValidation] = useState<FormValidation>({
    port: false,
    boatInfo: false,
    effortToday: null,
    effortLastWeek: null,
    location: null,
    fishingDetails: null,
  });

  const updateValidation = (section: keyof FormValidation, isValid: boolean | null) => {
    setFormValidation(prev => ({
      ...prev,
      [section]: isValid
    }));
  };

  const isFormValid = () => {
    if (!formValidation.port || !formValidation.boatInfo) {
      return false;
    }
    
    const effortTodayValid = formValidation.effortToday === true;
    const effortLastWeekValid = formValidation.effortLastWeek === true;
    const eitherEffortFilled = effortTodayValid || effortLastWeekValid;
    const eitherEffortAttempted = hasEffortToday || hasEffortLastWeek;
    
    if (eitherEffortAttempted && !eitherEffortFilled) {
      return false;
    }
    
    // If effort today is filled, location and fishing details must be filled
    if (effortTodayValid) {
      return formValidation.location === true && formValidation.fishingDetails === true;
    }
    
    // If only effort last week is filled, no need for location or fishing details
    return true;
  };

  // Handlers
  const handleBoatInfoChange = useCallback((data: BoatData) => {
    setValue("LandingFormDTO.boatData", data);
    const isValid = !!data.fleet_owner && Object.values(data).every(val => val != null && val !== 0);
    updateValidation('boatInfo', isValid);
  }, [setValue]);

  const handleEffortTodayChange = useCallback((data: EffortTodayData) => {
    setValue("LandingFormDTO.effortTodayData", data);
    
    // Check if any meaningful data has been entered
    const hasData = data.hours_fished > 0 || data.gear_entries.length > 0;
    setHasEffortToday(hasData);
    
    // Set validation status
    const isValid = hasData ? (data.hours_fished > 0 && data.gear_entries.length > 0) : null;
    updateValidation('effortToday', isValid);
    
    // Update gear selection for fishing details
    if (hasData) {
      setSelectedGears(data.gear_entries);
    } else {
      setSelectedGears([]);
    }
    
    // Update location and fishing details validation requirements based on effort today
    if (!hasData) {
      updateValidation('location', null);
      updateValidation('fishingDetails', null);
    }
  }, [setValue]);

  const handleEffortLastWeekChange = useCallback((data: EffortLastWeekData) => {
    setValue("LandingFormDTO.effortLastWeekData", data);
    
    // Check if any meaningful data has been entered
    const hasData = data.gear_entries.length > 0;
    setHasEffortLastWeek(hasData);
    
    // Set validation status
    const isValid = hasData ? true : null;
    updateValidation('effortLastWeek', isValid);
  }, [setValue]);

  const handleLocationsChange = useCallback((data: MapLocation|null) => {
    setValue("LandingFormDTO.location", data);
    setSelectedLocation(data);
    
    // Only validate if effort today is being filled
    if (hasEffortToday) {
      updateValidation('location', !!data);
    }
  }, [setValue, hasEffortToday]);

  const handleFishingDetailsChange = useCallback((data: FishingDetailsData) => {
    setValue("LandingFormDTO.fishingDetails", data);
    
    // Only validate if effort today is being filled
    if (hasEffortToday) {
      const isValid = data.fish_entries.length > 0;
      updateValidation('fishingDetails', isValid);
    }
  }, [setValue, hasEffortToday]);

  const onSubmit = async (formData: LandingsForm) => {
    console.log("Submitting form data:", formData);
  };

  useEffect(() => {
    setValue('LandingFormDTO.port', selectedPort);
    updateValidation('port', !!selectedPort);
  }, [selectedPort, setValue]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Landing Form</h1>
        <div className="w-72">
          <PortDropdown/>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <BoatInfo
          required={true}
          onChange={handleBoatInfoChange}
        />

        <EffortLastWeek
          required={false} // Make it optional
          onChange={handleEffortLastWeekChange}
        />
        <EffortToday
          required={false} // Make it optional
          onChange={handleEffortTodayChange}
        />
        
        {/* Conditionally show these sections only if Effort Today has data */}
        {hasEffortToday && (
          <>
            <MapWithMarkers
              required={true}
              onChange={handleLocationsChange}
            />
            
            <FishingDetails
              required={true}
              selectedLocation={selectedLocation}
              todaysGears={selectedGears}
              onChange={handleFishingDetailsChange}
            />
          </>
        )}

        <SubmitButton
          isSubmitting={isSubmitting}
          disabled={!isFormValid()}
          label="Submit"
        />
      </form>
    </div>
  );
}

export default Page;
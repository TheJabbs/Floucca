"use client";
import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { useFormsData } from "@/contexts/FormDataContext";
import BoatInfo from "@/components/forms-c/boat-form";
import EffortToday from "@/components/forms-c/effort-today-form";
import EffortLastWeek from "@/components/forms-c/effort-last-week-form";
import SubmitButton from "@/components/utils/submit-button";
import { usePort } from "@/contexts/PortContext";
import PortDropdown from "@/components/forms-c/port-dropdown";
import Notification from "@/components/utils/notification";
import { submitLandingForm, LandingFormDTO } from "@/services";
import { removeFromCache } from "@/components/utils/cache-utils";

const MapWithMarkers = dynamic(
  () => import("@/components/forms-c/map-with-markers"),
  { ssr: false }
);
import FishingDetails from "@/components/forms-c/fishing-details-form";

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
      equipment_id: string;
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
    price: number;
  }[];
}

interface LandingsForm {
  LandingFormDTO: {
    port: number | null;
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

interface FormNotification {
  type: "success" | "error";
  message: string;
}

function EffortAndLandingPage() {
  const { selectedPort } = usePort();

  // Get the cached form data from our FormsDataContext
  const { gears, species, ports, isLoading, error: dataError, refetch } = useFormsData();

  const defaultValues = {
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
  };

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<LandingsForm>({
    defaultValues,
  });

  // Shared state for components
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [selectedGears, setSelectedGears] = useState<
    {
      gear_code: number;
      gear_details: { detail_name: string; detail_value: string; equipment_id: string }[];
    }[]
  >([]);

  // Track if effort sections are actively being completed
  const [hasEffortToday, setHasEffortToday] = useState<boolean>(false);
  const [hasEffortLastWeek, setHasEffortLastWeek] = useState<boolean>(false);

  // Form reset flag to trigger reset in child components
  const [resetCounter, setResetCounter] = useState(0);

  // Notification state
  const [notification, setNotification] = useState<FormNotification | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const [formValidation, setFormValidation] = useState<FormValidation>({
    port: false,
    boatInfo: false,
    effortToday: null,
    effortLastWeek: null,
    location: null,
    fishingDetails: null,
  });

  const updateValidation = (
    section: keyof FormValidation,
    isValid: boolean | null
  ) => {
    setFormValidation((prev) => ({
      ...prev,
      [section]: isValid,
    }));
  };

  const isFormValid = () => {
    // Boat info must be filled
    if (!formValidation.boatInfo) {
      return false;
    }
  
    // Allow submission if only Boat Details are filled
    if (
      !hasEffortToday &&
      !hasEffortLastWeek
    ) {
      return true;
    }
  
    // If Effort Today is filled, location and fishing details are required
    if (hasEffortToday) {
      if (!formValidation.location || !formValidation.fishingDetails) {
        return false;
      }
    }
  
    return true;
  };
  
  const resetFormState = () => {
    reset(defaultValues);

    setSelectedLocation(null);
    setSelectedGears([]);
    setHasEffortToday(false);
    setHasEffortLastWeek(false);

    setFormValidation({
      port: !!selectedPort,
      boatInfo: false,
      effortToday: null,
      effortLastWeek: null,
      location: null,
      fishingDetails: null,
    });

    setResetCounter((prev) => prev + 1);
  };

  const handleCloseNotification = useCallback(() => {
    setIsNotificationVisible(false);
  }, []);

  const handleBoatInfoChange = useCallback(
    (data: BoatData) => {
      setValue("LandingFormDTO.boatData", data);
      const isValid =
        !!data.fleet_owner &&
        data.fleet_registration > 0 &&
        data.fleet_size > 0 &&
        data.fleet_crew > 0 &&
        data.fleet_max_weight > 0 &&
        data.fleet_length > 0;
      updateValidation("boatInfo", isValid);
    },
    [setValue]
  );

  const handleEffortTodayChange = useCallback(
    (data: EffortTodayData) => {
      setValue("LandingFormDTO.effortTodayData", data);

      const hasData = data.hours_fished > 0 || data.gear_entries.length > 0;
      setHasEffortToday(hasData);

      const isValid = hasData
        ? data.hours_fished > 0 && data.gear_entries.length > 0
        : null;
      updateValidation("effortToday", isValid);

      if (hasData) {
        setSelectedGears(data.gear_entries);
      } else {
        setSelectedGears([]);
      }

      if (!hasData) {
        updateValidation("location", null);
        updateValidation("fishingDetails", null);
      }
    },
    [setValue]
  );

  const handleEffortLastWeekChange = useCallback(
    (data: EffortLastWeekData) => {
      setValue("LandingFormDTO.effortLastWeekData", data);
      const hasData = data.gear_entries.length > 0;
      setHasEffortLastWeek(hasData);
      const isValid = hasData ? true : null;
      updateValidation("effortLastWeek", isValid);
    },
    [setValue]
  );

  const handleLocationsChange = useCallback(
    (data: MapLocation | null) => {
      setValue("LandingFormDTO.location", data);
      setSelectedLocation(data);

      // Only validate if effort today is being filled
      if (hasEffortToday) {
        updateValidation("location", !!data);
      }
    },
    [setValue, hasEffortToday]
  );

  const handleFishingDetailsChange = useCallback(
    (data: FishingDetailsData) => {
      setValue("LandingFormDTO.fishingDetails", data);

      // Only validate if effort today is being filled
      if (hasEffortToday) {
        const isValid = data.fish_entries.length > 0;
        updateValidation("fishingDetails", isValid);
      }
    },
    [setValue, hasEffortToday]
  );

  const onSubmit = async (formData: LandingsForm) => {
    try {
      setNotification(null);
      setIsNotificationVisible(false);

      // Extract data from the form
      const {
        port,
        boatData,
        effortTodayData,
        effortLastWeekData,
        location,
        fishingDetails,
      } = formData.LandingFormDTO;

      if (!port) {
        throw new Error("Port must be selected");
      }

      // Structure data according to the CreateFormLandingDto expected by the backend
      const apiPayload: LandingFormDTO = {
        form: {
          port_id: port,
          user_id: 1,
          fisher_name: boatData.fleet_owner,
        },
        boat_details: {
          fleet_owner: boatData.fleet_owner || "Unknown",
          fleet_registration: boatData.fleet_registration || 0,
          fleet_size: boatData.fleet_size || 0,
          fleet_crew: boatData.fleet_crew || 0,
          fleet_max_weight: boatData.fleet_max_weight || 0,
          fleet_length: boatData.fleet_length || 0,
        }
      };

      // Only add landing if location is provided
      if (location && location.lat && location.lng) {
        apiPayload.landing = {
          latitude: location.lat,
          longitude: location.lng,
        };
      }

      // Only include landing data if effort today is filled
      if (hasEffortToday) {
        // Only add fish entries if there are any
        if (fishingDetails.fish_entries && fishingDetails.fish_entries.length > 0) {
          apiPayload.fish = fishingDetails.fish_entries.map((entry) => ({
            specie_code: entry.specie_code,
            gear_code: entry.gear_code,
            fish_weight: entry.fish_weight,
            fish_length: entry.fish_length,
            fish_quantity: entry.fish_quantity,
            price: entry.price || 0,
          }));
        }

        // Only add effort if hours_fished is provided
        if (effortTodayData.hours_fished > 0) {
          apiPayload.effort = {
            hours_fished: effortTodayData.hours_fished,
          };
        }

        // Only add gear details if there are any
        if (effortTodayData.gear_entries && effortTodayData.gear_entries.length > 0) {
          apiPayload.gearDetail = effortTodayData.gear_entries.flatMap((gear) =>
            gear.gear_details.map((detail) => ({
              gear_code: gear.gear_code,
              detail_name: detail.detail_name,
              detail_value: detail.detail_value,
            }))
          );
        }
      }

      // Only add last week data if there are entries
      if (hasEffortLastWeek && effortLastWeekData.gear_entries.length > 0) {
        apiPayload.lastw = effortLastWeekData.gear_entries.map((gear) => ({
          gear_code: gear.gear_code,
          days_fished: gear.days_used,
        }));
      }

      console.log("Submitting API payload:", JSON.stringify(apiPayload, null, 2));

      // Send data to the API endpoint
      const response = await submitLandingForm(apiPayload);

      // Handle successful response
      console.log("API Response:", response);

      // Clear the submission history cache to force a refresh on the next visit
      removeFromCache('flouca_submissions');
      removeFromCache('flouca_submissions_timestamp');

      // Show success message
      setNotification({
        type: "success",
        message:
          "Form submitted successfully! Your data has been recorded.",
      });
      setIsNotificationVisible(true);

      // Reset the form after successful submission
      resetFormState();
    } catch (error) {
      console.error("Error submitting form:", error);

      // Show more detailed error message if available
      let errorMessage = "There was an error submitting the form. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Try to extract error message from response
        errorMessage = JSON.stringify(error);
      }

      setNotification({
        type: "error",
        message: errorMessage,
      });
      setIsNotificationVisible(true);
    }
  };

  useEffect(() => {
    setValue("LandingFormDTO.port", selectedPort);
    updateValidation("port", !!selectedPort);
  }, [selectedPort, setValue]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p>{dataError}</p>
          <button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Landing Form</h1>
        <div className="w-72">
          <PortDropdown ports={ports} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <BoatInfo
          required={true}
          onChange={handleBoatInfoChange}
          key={`boat-info-${resetCounter}`}
        />

        <EffortLastWeek
          required={false}
          onChange={handleEffortLastWeekChange}
          gears={gears}  // Pass gears data
          key={`effort-last-week-${resetCounter}`}
        />

        <EffortToday
          required={false}
          onChange={handleEffortTodayChange}
          gears={gears}  // Pass gears data
          key={`effort-today-${resetCounter}`}
        />

        {/* Conditionally show these sections only if Effort Today has data */}
        {hasEffortToday && (
          <>
            <MapWithMarkers
              required={true}
              onChange={handleLocationsChange}
              key={`map-markers-${resetCounter}`}
            />

            <FishingDetails
              required={true}
              selectedLocation={selectedLocation}
              todaysGears={selectedGears}
              gears={gears}         // Pass gears data
              species={species}     // Pass species data
              onChange={handleFishingDetailsChange}
              key={`fishing-details-${resetCounter}`}
            />
          </>
        )}

        <SubmitButton
          isSubmitting={isSubmitting}
          disabled={!isFormValid()}
          label="Submit"
        />
      </form>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          isVisible={isNotificationVisible}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
}

export default EffortAndLandingPage;
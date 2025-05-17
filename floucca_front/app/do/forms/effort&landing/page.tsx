"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useForm, useWatch } from "react-hook-form";
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
import { useAuth } from '@/hooks/useAuth';

// Dynamic import for the map component since it uses browser APIs
const MapWithMarkers = dynamic(
  () => import("@/components/forms-c/map-with-markers"),
  { ssr: false }
);
import FishingDetails from "@/components/forms-c/fishing-details-form";

// Interfaces for form data structure
interface BoatData {
  fleet_owner: string;
  fleet_registration: number;
  fleet_hp: number;
  fleet_crew: number;
  fleet_max_weight: number;
  fleet_length: number;
}

interface MapLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface LandingFormValues {
  boatData: BoatData;
  effortToday: {
    hours_fished: number;
    gear_entries: {
      id?: string;
      gear_code: number;
      gear_details: {
        detail_name: string;
        detail_value: string;
        equipment_id: string;
      }[];
    }[];
  };
  effortLastWeek: {
    gear_entries: {
      id?: string;
      gear_code: number;
      days_used: number;
    }[];
  };
  location: MapLocation | null;
  fishingDetails: {
    fish_entries: {
      id?: string;
      location_id: number;
      gear_code: number;
      specie_code: number;
      fish_weight: number;
      fish_length: number;
      fish_quantity: number;
      price: number;
    }[];
  };
  port: number | null;
}

function EffortAndLandingPage() {
  const { selectedPort } = usePort();
  const { gears, species, ports, isLoading, error: dataError, refetch } = useFormsData();
  const { user } = useAuth();
  
  // Notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  // Initialize form
  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<LandingFormValues>({
    mode: "onChange",
    defaultValues: {
      port: selectedPort,
      boatData: {
        fleet_owner: "",
        fleet_registration: 0,
        fleet_hp: 0,
        fleet_crew: 0,
        fleet_max_weight: 0,
        fleet_length: 0,
      },
      effortToday: {
        hours_fished: 0,
        gear_entries: [],
      },
      effortLastWeek: {
        gear_entries: [],
      },
      location: null,
      fishingDetails: {
        fish_entries: [],
      },
    },
  });

  // Watch form values to determine conditional rendering
  const formValues = useWatch({ control });
  const hasEffortToday = !!formValues?.effortToday?.hours_fished && ((formValues?.effortToday?.gear_entries ?? []).length > 0);

  // Update port when selected from dropdown
  useEffect(() => {
    setValue("port", selectedPort);
  }, [selectedPort, setValue]);

  const handleCloseNotification = () => {
    setIsNotificationVisible(false);
  };

  const resetFormState = () => {
    reset({
      port: selectedPort,
      boatData: {
        fleet_owner: "",
        fleet_registration: 0,
        fleet_hp: 0,
        fleet_crew: 0,
        fleet_max_weight: 0,
        fleet_length: 0,
      },
      effortToday: {
        hours_fished: 0,
        gear_entries: [],
      },
      effortLastWeek: {
        gear_entries: [],
      },
      location: null,
      fishingDetails: {
        fish_entries: [],
      },
    });
  };

  // Form validation logic
  const isFormValid = () => {
    // Basic validation - port is required
    if (!formValues?.port) {
      return false;
    }
    
    // If effort today data exists, location and fishing details are required
    // if (hasEffortToday) {
    //   return !!formValues?.location && (formValues?.fishingDetails?.fish_entries ?? []).length > 0;
    // }
    
    // Otherwise just require some basic boat info
    return true;
  };

  const onSubmit = async (formData: LandingFormValues) => {
    try {
      setNotification(null);
      setIsNotificationVisible(false);

      if (!formData.port) {
        throw new Error("Port must be selected");
      }

      // Structure data according to the API expectations
      const apiPayload: LandingFormDTO = {
        form: {
          port_id: formData.port,
          user_id: user.user_id,
          fisher_name: formData.boatData.fleet_owner,
        },
        boat_details: {
          fleet_owner: formData.boatData.fleet_owner || "Unknown",
          fleet_registration: formData.boatData.fleet_registration || 0,
          fleet_hp: formData.boatData.fleet_hp || 0,
          fleet_crew: formData.boatData.fleet_crew || 0,
          fleet_max_weight: formData.boatData.fleet_max_weight || 0,
          fleet_length: formData.boatData.fleet_length || 0,
        }
      };

      // Only add landing if location is provided
      if (formData.location) {
        apiPayload.landing = {
          latitude: formData.location.lat,
          longitude: formData.location.lng,
        };
      }

      // Only include landing data if effort today is filled
      if (hasEffortToday) {
        // Only add fish entries if there are any
        if (formData.fishingDetails.fish_entries.length > 0) {
          apiPayload.fish = formData.fishingDetails.fish_entries.map(entry => ({
            specie_code: entry.specie_code,
            gear_code: entry.gear_code,
            fish_weight: entry.fish_weight,
            fish_length: entry.fish_length,
            fish_quantity: entry.fish_quantity,
            price: entry.price || 0,
          }));
        }

        // Only add effort if hours_fished is provided
        if (formData.effortToday.hours_fished > 0 && formData.effortToday.hours_fished <= 24) {
          apiPayload.effort = {
            hours_fished: formData.effortToday.hours_fished,
          };
        }

        // Only add gear details if there are any
        if (formData.effortToday.gear_entries.length > 0) {
          apiPayload.gearDetail = formData.effortToday.gear_entries.flatMap(gear =>
            gear.gear_details.map(detail => ({
              gear_code: gear.gear_code,
              detail_name: detail.detail_name,
              detail_value: detail.detail_value,
            }))
          );
        }
      }

      // Only add last week data if there are entries
      if (formData.effortLastWeek.gear_entries.length > 0) {
        apiPayload.lastw = formData.effortLastWeek.gear_entries.map(gear => ({
          gear_code: gear.gear_code,
          days_fished: gear.days_used,
        }));
      }

      console.log("Submitting API payload:", JSON.stringify(apiPayload, null, 2));

      // Send data to the API endpoint
      const response = await submitLandingForm(apiPayload);
      console.log("API Response:", response);

      // Clear the submission history cache to force a refresh on the next visit
      removeFromCache('flouca_submissions');
      removeFromCache('flouca_submissions_timestamp');

      // Show success message
      setNotification({
        type: "success",
        message: "Form submitted successfully! Your data has been recorded.",
      });
      setIsNotificationVisible(true);

      // Reset the form after successful submission
      resetFormState();
    } catch (error) {
      console.error("Error submitting form:", error);

      // Show error message
      let errorMessage = "There was an error submitting the form. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setNotification({
        type: "error",
        message: errorMessage,
      });
      setIsNotificationVisible(true);
    }
  };

  // Show loading state
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
        {/* Boat Information*/}
        <BoatInfo
          required={false}
          control={control}
        />

        {/* Effort Last Week */}
        <EffortLastWeek
          required={false}
          control={control}
          gears={gears}
        />

        {/* Effort Today */}
        <EffortToday
          required={false}
          control={control}
          gears={gears}
        />

        {/* Only show these sections if Effort Today has data */}
        {hasEffortToday && (
          <>
            {/* Map for Location Selection */}
            <MapWithMarkers
              required={false}
              control={control}
              setValue ={setValue}
            />

            {/* Fishing Details */}
            <FishingDetails
              required={false}
              control={control}
              gears={gears}
              species={species}
            />
          </>
        )}

        {/* Submit Button */}
        <SubmitButton
          isSubmitting={isSubmitting}
          disabled={!isFormValid()}
          label="Submit"
        />
      </form>

      {/* Notification component */}
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
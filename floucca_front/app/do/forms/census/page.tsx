"use client";

import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useFormsData } from "@/contexts/FormDataContext";
import { usePort } from "@/contexts/PortContext";
import PortDropdown from "@/components/forms-c/port-dropdown";
import BoatInfo from "@/components/forms-c/boat-form";
import GearUsageForm from "@/components/forms-c/gear-form";
import SubmitButton from "@/components/utils/submit-button";
import Notification from "@/components/utils/notification";
import { submitFleetSensesForm } from "@/services";
import { removeFromCache } from "@/components/utils/cache-utils";

interface BoatData {
  fleet_owner: string;
  fleet_registration: number;
  fleet_hp: number;
  fleet_crew: number;
  fleet_max_weight: number;
  fleet_length: number;
}

interface GearFormValues {
  gear_code: number;
  months: number[];
}

interface FleetSensesForm {
  boatData: BoatData;
  gearData: GearFormValues[];
  port: number | null;
}

function FleetSensesPage() {
  const { selectedPort } = usePort();
  const { ports, gears, isLoading, error } = useFormsData();
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { isSubmitting, isValid },
  } = useForm<FleetSensesForm>({
    mode: "onChange",
    defaultValues: {
      boatData: {
        fleet_owner: "",
        fleet_registration: 0,
        fleet_hp: 0,
        fleet_crew: 0,
        fleet_max_weight: 0,
        fleet_length: 0,
      },
      gearData: [],
      port: selectedPort,
    },
  });

  const formValues = useWatch({ control });
  const gearIsValid = (formValues?.gearData ?? []).length > 0;
  const portIsValid = formValues?.port != null;
  const isButtonEnabled = isValid && gearIsValid && portIsValid;

  useEffect(() => {
    setValue("port", selectedPort);
  }, [selectedPort, setValue, getValues]);

  const handleCloseNotification = () => {
    setIsNotificationVisible(false);
  };

  const resetFormState = () => {
    reset({
      boatData: {
        fleet_owner: "",
        fleet_registration: 0,
        fleet_hp: 0,
        fleet_crew: 0,
        fleet_max_weight: 0,
        fleet_length: 0,
      },
      gearData: [],
      port: selectedPort,
    });
  };

  const onSubmit = async (formData: FleetSensesForm) => {
    try {
      if (!formData.port) {
        throw new Error("Please select a port");
      }

      const apiPayload = {
        formDto: {
          port_id: formData.port,
          user_id: 1,
          fisher_name: formData.boatData.fleet_owner,
        },
        boatDetailDto: formData.boatData,
        gearUsageDto: formData.gearData.map((gear) => ({
          gear_code: gear.gear_code,
          months: gear.months,
        })),
      };

      console.log("Submitting fleet senses data:", apiPayload);

      const response = await submitFleetSensesForm(apiPayload);

      // Clear submission history cache to reflect the new submission
      removeFromCache("flouca_submissions");
      removeFromCache("flouca_submissions_timestamp");

      setNotification({
        type: "success",
        message: "Fleet senses data submitted successfully!",
      });
      setIsNotificationVisible(true);

      // Reset form after successful submission
      resetFormState();
    } catch (error) {
      console.error("Error submitting form:", error);

      let errorMessage = "Failed to submit form. Please try again.";
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

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state if data fetching failed
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
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
        <h1 className="text-2xl font-bold">Fleet Census Form</h1>
        <div className="w-72">
          <PortDropdown ports={ports} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <BoatInfo required={false} control={control} />
        <GearUsageForm gears={gears} required={true} control={control} />
        <SubmitButton
          isSubmitting={isSubmitting}
          disabled={!isButtonEnabled}
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

export default FleetSensesPage;

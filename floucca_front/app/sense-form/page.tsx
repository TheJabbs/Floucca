"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import BoatInfo from "@/components/forms-c/boat-form";
import GearSelector from "@/components/forms-c/gear-form";
import SubmitButton from "@/components/utils/submit-button";
import PortDropdown from "@/components/forms-c/port-dropdown";

interface BoatData {
  fleet_owner: string;
  fleet_registration: number;
  fleet_size: number;
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
  port: string;
}

function Page() {
  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<FleetSensesForm>({
    defaultValues: {
      boatData: {
        fleet_owner: "",
        fleet_registration: 0,
        fleet_size: 0,
        fleet_crew: 0,
        fleet_max_weight: 0,
        fleet_length: 0,
      },
      gearData: [],
      port: "",
    },
  });

  const [isValid, setIsValid] = useState(false);

  const handleBoatChange = (data: BoatData) => {
    setValue("boatData", data);
    checkFormValidity(data, null, getValues("port"));
  };

  const handleGearChange = (data: GearFormValues[]) => {
    setValue("gearData", data);
    checkFormValidity(null, data, getValues("port"));
  };

  const handlePortChange = (port: string) => {
    setValue("port", port);
    checkFormValidity(getValues("boatData"), getValues("gearData"), port);
  };

  const checkFormValidity = (
    boatData: BoatData | null,
    gearData: GearFormValues[] | null,
    port: string
  ) => {
    const currentBoatData = boatData || (getValues()?.boatData as BoatData);
    const currentGearData =
      gearData || (getValues()?.gearData as GearFormValues[]);
    const currentPort = port || getValues("port");

    const isBoatValid = Object.values(currentBoatData).every(
      (val) => val !== null && val !== undefined && val !== ""
    );
    const isGearValid =
      currentGearData?.length > 0 &&
      currentGearData.every((gear) => gear.gear_code && gear.months.length > 0);
    const isPortValid = currentPort !== "";

    setIsValid(isBoatValid && isGearValid && isPortValid);
  };

  const onSubmit = async (formData: FleetSensesForm) => {
    console.log("Submitting form data:", formData);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fleet Senses Form</h1>
        <div className="w-72"> {/* Fixed width container for dropdown */}
          <PortDropdown 
            selectedPort={getValues("port")} 
            onPortChange={handlePortChange} 
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <BoatInfo required={true} onChange={handleBoatChange} />
        <GearSelector onChange={handleGearChange} />
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
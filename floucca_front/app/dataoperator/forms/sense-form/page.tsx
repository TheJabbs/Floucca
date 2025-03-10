"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { usePort } from "@/contexts/PortContext";
import PortDropdown from "@/components/forms-c/port-dropdown";
import BoatInfo from "@/components/forms-c/boat-form";
import GearSelector from "@/components/forms-c/gear-form";
import SubmitButton from "@/components/utils/submit-button";

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
  port: number | null;
}

function Page() {
  const { selectedPort } = usePort();
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
      port: selectedPort,
    },
  });

  useEffect(() => {
    setValue('port', selectedPort);
    checkFormValidity(getValues('boatData'), getValues('gearData'), selectedPort);
  }, [selectedPort, setValue, getValues]);

  const [isValid, setIsValid] = useState(false);

  const handleBoatChange = (data: BoatData) => {
    setValue("boatData", data);
    checkFormValidity(data, null, getValues("port"));
  };

  const handleGearChange = (data: GearFormValues[]) => {
    setValue("gearData", data);
    checkFormValidity(null, data, getValues("port"));
  };

  const checkFormValidity = (
    boatData: BoatData | null,
    gearData: GearFormValues[] | null,
    port: number | null
  ) => {
    const currentBoatData = boatData || (getValues()?.boatData as BoatData);
    const currentGearData =
      gearData || (getValues()?.gearData as GearFormValues[]);
    const currentPort = port !== undefined ? port : getValues("port");

    const isBoatValid = currentBoatData && 
      !!currentBoatData.fleet_owner && 
      Object.values(currentBoatData).every(
        (val) => val !== null && val !== undefined && val !== ""
      );
      
    const isGearValid =
      currentGearData?.length > 0 &&
      currentGearData.every((gear) => gear.gear_code && gear.months.length > 0);
      
    const isPortValid = !!currentPort;

    setIsValid(isBoatValid && isGearValid && isPortValid);
  };

  const onSubmit = async (formData: FleetSensesForm) => {
    try {
      console.log("Submitting form data:", formData);
      
      const apiPayload = {
        formDto: {
          port_id: formData.port,
          user_id: 1, 
          fisher_name: formData.boatData.fleet_owner,
        },
        boatDetailDto: formData.boatData,
        gearUsageDto: formData.gearData.map(gear => ({
          gear_code: gear.gear_code,
          months: gear.months
        }))
      };
      
      console.log("API payload:", apiPayload);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Fleet senses data submitted successfully!");
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fleet Senses Form</h1>
        <div className="w-72">
          <PortDropdown/>
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
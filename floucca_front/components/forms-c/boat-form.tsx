"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormInput from "../utils/form-input";

interface BoatInfoProps {
  required?: boolean;
  onChange: (boatData: BoatFormValues) => void;
}

interface BoatFormValues {
  fleet_owner: string;
  fleet_registration: number;
  fleet_size: number;
  fleet_crew: number;
  fleet_max_weight: number;
  fleet_length: number;
}

const BoatInfo: React.FC<BoatInfoProps> = ({ required, onChange }) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<BoatFormValues>({
    defaultValues: {
      fleet_owner: "",
      fleet_registration: undefined,
      fleet_size: undefined,
      fleet_crew: undefined,
      fleet_max_weight: undefined,
      fleet_length: undefined,
    },
  });

  // Watch the form data and trigger onChange
  const formData = watch();
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  return (
    <div className="boat-info">
      <h2 className="text-xl font-bold mb-4">Boat Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Boat Owner Name"
          name="fleet_owner"
          required={required}
          placeholder="Enter owner's name"
          register={register}
          error={errors.fleet_owner?.message}
        />

        <FormInput
          label="Boat Registration Number"
          name="fleet_registration"
          required={required}
          placeholder="Enter registration number"
          type="number"
          register={register}
          error={errors.fleet_registration?.message}
        />
        <FormInput
          label="Boat Fleet Size"
          name="fleet_size"
          required={required}
          placeholder="Enter fleet size"
          type="number"
          register={register}
          error={errors.fleet_size?.message}
        />
        <FormInput
          label="Fleet Crew Count"
          name="fleet_crew"
          required={required}
          placeholder="Enter crew count"
          register={register}
          type="number"
          error={errors.fleet_crew?.message}
        />
        <FormInput
          label="Boat Maximum Weight (kg)"
          name="fleet_max_weight"
          required={required}
          placeholder="Enter max weight"
          register={register}
          type="number"
          error={errors.fleet_max_weight?.message}
        />
        <FormInput
          label="Boat Length (meters)"
          name="fleet_length"
          required={required}
          placeholder="Enter length"
          register={register}
          type="number"
          error={errors.fleet_length?.message}
        />
      </div>
    </div>
  );
};

export default BoatInfo;

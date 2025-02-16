'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormInput from '../utils/form-input';

interface BoatData {
  fleet_owner: string;
  fleet_registration: number;
  fleet_size: number;
  fleet_crew: number;
  fleet_max_weight: number;
  fleet_length: number;
}

interface BoatInfoProps {
  required?: boolean;
  onChange: (boatData: BoatData) => void;
}

const BoatInfo: React.FC<BoatInfoProps> = ({ required = false, onChange }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BoatData>({
    defaultValues: {
      fleet_owner: '',
      fleet_registration: 0,
      fleet_size: 0,
      fleet_crew: 0,
      fleet_max_weight: 0,
      fleet_length: 0,
    },
  });

  useEffect(() => {
    onChange(watch());
  }, [watch(), onChange]);

  return (
    <div className="boat-info">
      <h2 className="text-xl font-bold mb-4">Boat Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fleet Owner */}
        <Controller
          name="fleet_owner"
          control={control}
          rules={{ required: required ? 'Owner name is required' : false }}
          render={({ field }) => (
            <FormInput
              label="Boat Owner Name"
              {...field}
              placeholder="Enter owner's name"
              error={errors.fleet_owner?.message}
            />
          )}
        />

        <Controller
          name="fleet_registration"
          control={control}
          rules={{ required: required ? 'Registration is required' : false, min: 1 }}
          render={({ field }) => (
            <FormInput
              label="Boat Registration Number"
              {...field}
              type="number"
              placeholder="Enter registration number"
              error={errors.fleet_registration?.message}
            />
          )}
        />

        <Controller
          name="fleet_size"
          control={control}
          rules={{ required: required ? 'Fleet size is required' : false, min: 1 }}
          render={({ field }) => (
            <FormInput
              label="Boat Fleet Size"
              {...field}
              type="number"
              placeholder="Enter fleet size"
              error={errors.fleet_size?.message}
            />
          )}
        />

        <Controller
          name="fleet_crew"
          control={control}
          rules={{ required: required ? 'Crew count is required' : false, min: 1 }}
          render={({ field }) => (
            <FormInput
              label="Fleet Crew Count"
              {...field}
              type="number"
              placeholder="Enter crew count"
              error={errors.fleet_crew?.message}
            />
          )}
        />

        <Controller
          name="fleet_max_weight"
          control={control}
          rules={{ required: required ? 'Max weight is required' : false, min: 1 }}
          render={({ field }) => (
            <FormInput
              label="Boat Maximum Weight (kg)"
              {...field}
              type="number"
              placeholder="Enter max weight"
              error={errors.fleet_max_weight?.message}
            />
          )}
        />

        <Controller
          name="fleet_length"
          control={control}
          rules={{ required: required ? 'Length is required' : false, min: 1 }}
          render={({ field }) => (
            <FormInput
              label="Boat Length (m)"
              {...field}
              type="number"
              placeholder="Enter length"
              error={errors.fleet_length?.message}
            />
          )}
        />
      </div>
    </div>
  );
};

export default BoatInfo;

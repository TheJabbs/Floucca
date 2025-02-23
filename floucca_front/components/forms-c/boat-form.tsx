import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormInput from "../utils/form-input";
import { Anchor, Users, Scale, Ruler, FileText, Hash } from "lucide-react";

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

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value.fleet_owner !== undefined) {
        onChange(value as BoatFormValues);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="rounded-lg border border-blue-200 p-6 space-y-6 ">
      <div className="flex items-center gap-3 text-blue-700">
        <h2 className="text-xl font-semibold">Boat Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Boat Identity Section */}
        <div className="space-y-4 p-4 rounded-lg border border-blue-200 bg-blue-50">
          <div className="flex items-center gap-2 text-gray-800">
            <FileText className="w-4 h-4" />
            <h3 className="font-medium">Boat Identity</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FormInput
                label="Boat Owner Name"
                name="fleet_owner"
                required={required}
                placeholder="Enter owner's name"
                register={register}
                error={errors.fleet_owner?.message}
              />
            </div>
            <div className="flex items-center gap-2">
              <FormInput
                label="Boat Registration Number"
                name="fleet_registration"
                required={required}
                placeholder="Enter registration number"
                type="number"
                register={register}
                error={errors.fleet_registration?.message}
              />
            </div>
          </div>
        </div>

        {/* Fleet Details Section */}
        <div className="space-y-4 p-4 rounded-lg border border-blue-200 bg-blue-50">
          <div className="flex items-center gap-2 text-gray-800">
            <Anchor className="w-4 h-4" />
            <h3 className="font-medium">Fleet Details</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FormInput
                label="Boat Fleet Size"
                name="fleet_size"
                required={required}
                placeholder="Enter fleet size"
                type="number"
                register={register}
                error={errors.fleet_size?.message}
              />
            </div>
            <div className="flex items-center gap-2">
              <FormInput
                label="Fleet Crew Count"
                name="fleet_crew"
                required={required}
                placeholder="Enter crew count"
                register={register}
                type="number"
                error={errors.fleet_crew?.message}
              />
            </div>
          </div>
        </div>

        {/* Boat Specifications Section */}
        <div className="space-y-4 p-4 rounded-lg border border-blue-200 bg-blue-50 md:col-span-2">
          <div className="flex items-center gap-2 text-gray-800">
            <Scale className="w-4 h-4" />
            <h3 className="font-medium">Boat Specifications</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FormInput
                label="Boat Maximum Weight"
                name="fleet_max_weight"
                required={required}
                placeholder="Enter max weight (kg)"
                register={register}
                type="number"
                error={errors.fleet_max_weight?.message}
              />
            </div>
            <div className="flex items-center gap-2">
              <FormInput
                label="Boat Length"
                name="fleet_length"
                required={required}
                placeholder="Enter length (meters)"
                register={register}
                type="number"
                error={errors.fleet_length?.message}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoatInfo;
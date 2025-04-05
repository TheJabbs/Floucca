"use client";

import React from "react";
import { Control } from "react-hook-form";
import { Anchor, Scale, FileText } from "lucide-react";
import FormField from "../utils/form-field";

interface BoatInfoProps {
  required?: boolean;
  control: Control<any>;
}

const BoatInfo: React.FC<BoatInfoProps> = ({ required, control }) => {
  return (
    <div className="rounded-lg border border-blue-200 p-6 space-y-6">
      <div className="flex items-center gap-3 text-gray-600">
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
              <FormField
                control={control}
                name="boatData.fleet_owner"
                label="Boat Owner Name"
                required={required}
                placeholder="Enter owner's name"
              />
            </div>
            <div className="flex items-center gap-2">
              <FormField
                control={control}
                name="boatData.fleet_registration"
                label="Boat Registration Number"
                required={required}
                placeholder="Enter registration number"
                type="number"
                min={1}
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
              <FormField
                control={control}
                name="boatData.fleet_hp"
                label="Boat Fleet Horse Power"
                required={required}
                placeholder="Enter fleet horse power"
                type="number"
                min={1}
              />
            </div>
            <div className="flex items-center gap-2">
              <FormField
                control={control}
                name="boatData.fleet_crew"
                label="Fleet Crew Count"
                required={required}
                placeholder="Enter crew count"
                type="number"
                min={1}
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
              <FormField
                control={control}
                name="boatData.fleet_max_weight"
                label="Boat Maximum Weight"
                required={required}
                placeholder="Enter max weight (kg)"
                type="number"
                min={0}
              />
            </div>
            <div className="flex items-center gap-2">
              <FormField
                control={control}
                name="boatData.fleet_length"
                label="Boat Length"
                required={required}
                placeholder="Enter length (meters)"
                type="number"
                min={0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoatInfo;
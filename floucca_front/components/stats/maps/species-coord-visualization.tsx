"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSpecies, usePeriods } from "@/hooks/useSpeciesData";
import { getSpeciesCoordinates, SpeciesCoordinates } from "@/services/coordinatesService";
import SpeciesSelection from "./species-selection";
import PeriodSelection from "./period-selection";
import HeatMapScriptLoader from "./heatmap-script";

const ConvexHullMap = dynamic(() => import("./convex-hull-map"), { ssr: false });
const HeatMap = dynamic(() => import("./heat-map"), { ssr: false });

// Map colors for different species
const SPECIES_COLORS = [
  "#E53935", // Red
  "#1E88E5", // Blue
  "#43A047", // Green
];

const SpeciesCoordinatesVisualization: React.FC = () => {
  const { data: species, isLoading: speciesLoading } = useSpecies();
  const { data: periods, isLoading: periodsLoading } = usePeriods();
  
  const [selectedSpecies, setSelectedSpecies] = useState<number[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [coordinatesData, setCoordinatesData] = useState<SpeciesCoordinates[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get species names for the selected codes
  const selectedSpeciesInfo = useMemo(() => {
    return selectedSpecies.map((code, index) => ({
      code,
      name: species.find(s => s.specie_code === code)?.specie_name || `Species ${code}`,
      color: SPECIES_COLORS[index % SPECIES_COLORS.length]
    }));
  }, [selectedSpecies, species]);

  // Fetch coordinates when selection changes
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (selectedSpecies.length === 0) {
        setCoordinatesData([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const filter = {
          period: selectedPeriod || undefined,
          specie_code: selectedSpecies
        };

        const data = await getSpeciesCoordinates(filter);
        setCoordinatesData(data);
      } catch (err) {
        console.error("Error fetching coordinates:", err);
        setError("Failed to load fishing location data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordinates();
  }, [selectedSpecies, selectedPeriod]);

  const handleSpeciesChange = (species: number[]) => {
    setSelectedSpecies(species);
  };

  const handlePeriodChange = (period: string | null) => {
    setSelectedPeriod(period);
  };

  // Get coordinates for a specific species
  const getCoordinatesForSpecies = (specieCode: number) => {
    const speciesData = coordinatesData.find(data => data.specie_code === specieCode);
    return speciesData?.landing || [];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SpeciesSelection 
          species={species}
          onSpeciesChange={handleSpeciesChange}
          maxSelections={3}
          isLoading={speciesLoading}
        />

        <PeriodSelection
          periods={periods}
          onPeriodChange={handlePeriodChange}
          isLoading={periodsLoading}
        />
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {selectedSpecies.length === 0 ? (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-blue-700">
          Please select at least one species to visualize fishing locations.
        </div>
      ) : (
        <HeatMapScriptLoader>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {selectedSpeciesInfo.map(species => (
                <div key={`maps-${species.code}`} className="space-y-2">
  <h3 className="text-lg font-semibold text-center">{species.name}</h3>

  <div className="flex gap-6">
    <div className="h-80 w-1/2">
      <ConvexHullMap
        coordinates={getCoordinatesForSpecies(species.code)}
        color={species.color}
        speciesName={species.name}
        isLoading={isLoading}
      />
    </div>

    <div className="h-80 w-1/2">
      <HeatMap
        coordinates={getCoordinatesForSpecies(species.code)}
        speciesName={species.name}
        isLoading={isLoading}
      />
    </div>
  </div>
</div>

            ))}
          </div>
        </HeatMapScriptLoader>
      )}
    </div>
  );
};

export default SpeciesCoordinatesVisualization;
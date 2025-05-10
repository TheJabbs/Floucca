"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

interface Species {
  specie_code: number;
  specie_name: string;
}

interface SpeciesSelectionProps {
  species: Species[];
  onSpeciesChange: (selectedSpecies: number[]) => void;
  maxSelections?: number;
  isLoading?: boolean;
}

interface FormValues {
  selectedSpecies: number[];
}

const SpeciesSelection: React.FC<SpeciesSelectionProps> = ({
  species,
  onSpeciesChange,
  maxSelections = 3,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { setValue, watch } = useForm<FormValues>({
    defaultValues: {
      selectedSpecies: [],
    },
  });
  
  const selectedSpecies = watch("selectedSpecies") || [];
  
  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Notify parent component when selection changes
  useEffect(() => {
    onSpeciesChange(selectedSpecies);
  }, [selectedSpecies, onSpeciesChange]);
  
  const handleSpeciesToggle = (specieCode: number) => {
    const currentSelection = [...selectedSpecies];
    const index = currentSelection.indexOf(specieCode);
    
    if (index === -1) {
      // Add species if under max limit
      if (currentSelection.length < maxSelections) {
        setValue("selectedSpecies", [...currentSelection, specieCode]);
      }
    } else {
      // Remove species
      currentSelection.splice(index, 1);
      setValue("selectedSpecies", currentSelection);
    }
  };
  
  const clearSelection = () => {
    setValue("selectedSpecies", []);
  };

  const filteredSpecies = species.filter((species) =>
    species.specie_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow border animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-full mb-4"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow border">
      <h3 className="font-medium mb-2">Select Species (Max {maxSelections})</h3>
      
      <div className="relative" ref={dropdownRef}>
        {/* Selected species pills */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedSpecies.map((specieCode) => {
            const species_info = species.find((s) => s.specie_code === specieCode);
            if (!species_info) return null;
            
            return (
              <div 
                key={specieCode}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                <span className="mr-1">{species_info.specie_name}</span>
                <button 
                  onClick={() => handleSpeciesToggle(specieCode)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          
          {selectedSpecies.length > 0 && (
            <button 
              onClick={clearSelection}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Clear all
            </button>
          )}
        </div>
        
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          
          <input
            type="text"
            placeholder="Search species..."
            className="pl-10 pr-10 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setIsDropdownOpen(true)}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-700"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {isDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        {/* Dropdown list */}
        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredSpecies.length === 0 ? (
              <div className="p-3 text-gray-500 text-center">No species found</div>
            ) : (
              filteredSpecies.map((species) => {
                const isSelected = selectedSpecies.includes(species.specie_code);
                const isDisabled = selectedSpecies.length >= maxSelections && !isSelected;
                
                return (
                  <div
                    key={species.specie_code}
                    className={`px-4 py-2 cursor-pointer ${
                      isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => {
                      if (!isDisabled) {
                        handleSpeciesToggle(species.specie_code);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="font-medium">{species.specie_name}</div>
                      </div>
                      {isSelected && (
                        <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeciesSelection;
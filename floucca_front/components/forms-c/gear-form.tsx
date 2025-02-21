import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AddButton from '../utils/form-button';
import { getAllGears } from '@/app/services/gearService';
import Dropdown from '../dropdown/dropdown';

interface Gear {
  gear_code: number;
  gear_name: string;
  equipment_id: string;
  equipment_name: string;
}

interface GearSelectorProps {
  onChange: (data: { gear_code: number; months: number[] }[]) => void;
  required?: boolean;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const GearSelector: React.FC<GearSelectorProps> = ({ onChange, required = false }) => {
  const [gears, setGears] = useState<Gear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGears, setSelectedGears] = useState<Array<{ 
    gear_code: number; 
    gear_name: string; 
    months: number[] 
  }>>([]);
  const [currentSelection, setCurrentSelection] = useState({
    gear_code: 0,
    months: [] as number[]
  });

  useEffect(() => {
    const fetchGears = async () => {
      setIsLoading(true); 
      try {
        const data = await getAllGears();  
        setGears(data); 
      } catch (error) {
        console.error('Error fetching gears:', error);
      } finally {
        setIsLoading(false);  
      }
    };

    fetchGears();
  }, []);  

  const availableGears = gears.filter(gear => 
    !selectedGears.some(selected => selected.gear_code === gear.gear_code)
  );

  const handleGearChange = (gearCode: number) => {
    setCurrentSelection(prev => ({
      ...prev,
      gear_code: Number(gearCode)
    }));
  };

  const handleMonthToggle = (month: number) => {
    setCurrentSelection(prev => {
      const months = prev.months.includes(month)
        ? prev.months.filter(m => m !== month)
        : [...prev.months, month].sort((a, b) => a - b);
      return { ...prev, months };
    });
  };

  const handleAddGear = () => {
    if (currentSelection.gear_code === 0 || currentSelection.months.length === 0) return;

    const selectedGear = gears.find(g => g.gear_code === currentSelection.gear_code);
    if (selectedGear) {
      const newGear = {
        gear_code: selectedGear.gear_code,
        gear_name: `${selectedGear.gear_name} - ${selectedGear.equipment_name}`,
        months: currentSelection.months
      };
      
      const updatedGears = [...selectedGears, newGear];
      setSelectedGears(updatedGears);
      onChange(updatedGears);
      
      setCurrentSelection({ gear_code: 0, months: [] });
    }
  };

  const handleRemoveGear = (index: number) => {
    const updatedGears = selectedGears.filter((_, i) => i !== index);
    setSelectedGears(updatedGears);
    onChange(updatedGears);
  };

  if (isLoading) {
    return <div>Loading gears...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Fleet Gear Usage</h2>
      
      <div className="flex items-start gap-3">
        <Dropdown
          label="Select Gear"
          options={availableGears.map(gear => ({
            value: gear.gear_code,
            label: `${gear.gear_name} - ${gear.equipment_name}`
          }))}
          selectedValue={currentSelection.gear_code}
          onChange={handleGearChange}
          required={required}
          disabled={availableGears.length === 0}
        />

        <div className="flex-1 mt-1">
          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Select Months {required && <span className="text-red-500">*</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {MONTHS.map(month => (
              <button
                key={month}
                type="button"
                onClick={() => handleMonthToggle(month)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
                  ${currentSelection.months.includes(month)
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-blue-400'
                  }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <AddButton
            onClick={handleAddGear}
            disabled={currentSelection.gear_code === 0 || currentSelection.months.length === 0}
          />
        </div>
      </div>

      {selectedGears.length > 0 ? (
        <div className="space-y-3 mt-4">
          {selectedGears.map((gear, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-md"
            >
              <span className="font-medium">{gear.gear_name}</span>
              <span className="text-gray-600">
                Months: {gear.months.join(', ')}
              </span>
              <button
                onClick={() => handleRemoveGear(index)}
                className="ml-auto text-red-500 hover:text-red-700"
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic mt-4">No gear added yet.</p>
      )}
    </div>
  );
};

export default GearSelector;
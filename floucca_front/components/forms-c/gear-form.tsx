'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import AddButton from '../utils/form-button';

// TODO: Replace with actual API call when backend is connected
const fetchGears = async () => {
  return [
    { gear_code: 1, gear_name: 'Trawl Net' },
    { gear_code: 2, gear_name: 'Gill Net' },
    { gear_code: 3, gear_name: 'Long Line' },
    { gear_code: 4, gear_name: 'Trap' },
  ];
};

interface GearEntry {
  gear_code: number;
  months?: number[];
  times_used?: number;
  specs?: string;
}

interface Gear {
  gear_code: number;
  gear_name: string;
}

interface GearFormProps {
  mode: 'fleetSenses' | 'effortToday' | 'effortLastWeek' | 'fishingDetails';
  onChange: (gearEntries: GearEntry[]) => void;
}

const GearForm: React.FC<GearFormProps> = ({ mode, onChange }) => {
  const { register, control, handleSubmit, watch, setValue, getValues, reset } = useForm<{ gearEntry: GearEntry }>(
    {
      defaultValues: {
        gearEntry: { gear_code: 0, months: [], times_used: 1, specs: '' },
      },
    }
  );

  const [availableGears, setAvailableGears] = React.useState<Gear[]>([]);

  useEffect(() => {
    fetchGears().then(setAvailableGears); // Fetch gears from API when backend is available
  }, []);

  useEffect(() => {
    onChange(getValues('gearEntry') ? [getValues('gearEntry')] : []);
  }, [watch('gearEntry'), onChange]);

  const addGear = (data: { gearEntry: GearEntry }) => {
    setValue('gearEntry', { ...data.gearEntry });
    reset();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {mode === 'fleetSenses' && 'Gear Used This Year'}
        {mode === 'effortToday' && 'Gear Used Today'}
        {mode === 'effortLastWeek' && 'Gear Used Last Week'}
        {mode === 'fishingDetails' && 'Fishing Details - Gear Used'}
      </h2>

      <form onSubmit={handleSubmit(addGear)} className="flex flex-col gap-4">
        <div>
          <label className="block font-medium">Select Gear</label>
          <select
            {...register('gearEntry.gear_code', { required: true })}
            className="w-64 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>-- Select Gear --</option>
            {availableGears.map((gear) => (
              <option key={gear.gear_code} value={gear.gear_code}>
                {gear.gear_name}
              </option>
            ))}
          </select>
        </div>

        {mode === 'fleetSenses' && (
          <Controller
            name="gearEntry.months"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() =>
                      field.onChange(
                        field.value?.includes(month)
                          ? field.value.filter((m) => m !== month)
                          : [...(field.value || []), month]
                      )
                    }
                    className={`w-8 h-8 rounded-full flex items-center justify-center border text-sm ${
                      field.value?.includes(month) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          />
        )}

        {mode === 'effortLastWeek' && (
          <input
            type="number"
            min={1}
            max={7}
            placeholder="Times Used (1-7)"
            className="w-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('gearEntry.times_used')}
          />
        )}

        {mode === 'effortToday' && (
          <input
            type="text"
            placeholder="Enter gear specs (e.g., Net 20m²)"
            className="w-64 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('gearEntry.specs')}
          />
        )}

        <AddButton onClick={handleSubmit(addGear)} />
      </form>

      <div className="space-y-3 mt-6">
        {!watch('gearEntry.gear_code') && <p className="text-gray-500 italic">No gear added yet.</p>}
        {watch('gearEntry.gear_code') && (
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
            <span className="font-medium">
              {availableGears.find((g) => g.gear_code === watch('gearEntry.gear_code'))?.gear_name}
            </span>
            {mode === 'fleetSenses' && <span className="text-gray-600">Months: {watch('gearEntry.months')?.join(', ')}</span>}
            {mode === 'effortLastWeek' && <span className="text-gray-600">Times Used: {watch('gearEntry.times_used')}</span>}
            {mode === 'effortToday' && <span className="text-gray-600">Specs: {watch('gearEntry.specs')}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default GearForm;

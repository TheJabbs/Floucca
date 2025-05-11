import React, { useState, useEffect } from "react";
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { getRegions, getCoops, getPorts, getPeriods } from "@/services";
import { WorkloadFilterValues } from "@/app/dashboard-admin/workload-stat/page";

interface FilterSectionProps {
  control: Control<WorkloadFilterValues>;
  register: UseFormRegister<WorkloadFilterValues>;
  setValue: UseFormSetValue<WorkloadFilterValues>;
  watch: UseFormWatch<WorkloadFilterValues>;
}

interface Option {
  value: number;
  label: string;
}

interface Period {
  period_date: string;
  period_status: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  control,
  register,
  setValue,
  watch
}) => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [regions, setRegions] = useState<Option[]>([]);
  const [coops, setCoops] = useState<Option[]>([]);
  const [ports, setPorts] = useState<Option[]>([]);
  const [filteredCoops, setFilteredCoops] = useState<Option[]>([]);
  const [filteredPorts, setFilteredPorts] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedRegion = watch("region")?.[0];
  const selectedCoop = watch("coop")?.[0];

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [periodsData, regionsData, coopsData, portsData] = await Promise.all([
          getPeriods(),
          getRegions(),
          getCoops(),
          getPorts()
        ]);

        // Map periods to display format
        setPeriods(periodsData);

        // Map regions to option format
        setRegions(
          regionsData.map((region) => ({
            value: region.region_code,
            label: region.region_name
          }))
        );

        // Map coops to option format
        const coopOptions = coopsData.map((coop) => ({
          value: coop.coop_code,
          label: coop.coop_name,
          region: coop.region_code
        }));
        setCoops(coopOptions);

        // Map ports to option format
        const portOptions = portsData.map((port) => ({
          value: port.port_id,
          label: port.port_name,
          coop: port.coop_code
        }));
        setPorts(portOptions);

        setFilteredCoops(coopOptions);
        setFilteredPorts(portOptions);

      } catch (err) {
        console.error("Error fetching filter options:", err);
        setError("Failed to load filter options");
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Update filtered coops based on selected region
  useEffect(() => {
    if (selectedRegion) {
      const filtered = coops.filter((coop: any) => coop.region === selectedRegion);
      setFilteredCoops(filtered);
      
      // Clear selected coop if it doesn't match current region
      const currentCoop = watch("coop")?.[0];
      if (currentCoop && !filtered.some(c => c.value === currentCoop)) {
        setValue('coop', undefined);
        setValue('port_id', undefined); // Also clear port selection
      }
    } else {
      setFilteredCoops(coops);
    }
  }, [selectedRegion, coops, setValue, watch]);

  // Update filtered ports based on selected coop
  useEffect(() => {
    if (selectedCoop) {
      const filtered = ports.filter((port: any) => port.coop === selectedCoop);
      setFilteredPorts(filtered);
      
      // Clear selected port if it doesn't match current coop
      const currentPort = watch("port_id")?.[0];
      if (currentPort && !filtered.some(p => p.value === currentPort)) {
        setValue('port_id', undefined);
      }
    } else {
      setFilteredPorts(ports);
    }
  }, [selectedCoop, ports, setValue, watch]);

  // Handle region change
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue('region', value ? [parseInt(value)] : undefined);
    setValue('coop', undefined); // Clear coop when region changes
    setValue('port_id', undefined); // Clear port when region changes
  };

  // Handle coop change
  const handleCoopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue('coop', value ? [parseInt(value)] : undefined);
    setValue('port_id', undefined); // Clear port when coop changes
  };

  // Handle port change
  const handlePortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue('port_id', value ? [parseInt(value)] : undefined);
  };

  // Format date for display
  const formatPeriodDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };
  
  if (error) {
    return <div className="py-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
      <h2 className="text-lg font-medium mb-4">Filter Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Period filter */}
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
            Time Period
          </label>
          <select
            id="period"
            {...register("period")}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Periods</option>
            {periods.map((period) => (
              <option key={period.period_date} value={period.period_date}>
                {formatPeriodDate(period.period_date)} ({period.period_status})
              </option>
            ))}
          </select>
        </div>

        {/* Region filter */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
            Region
          </label>
          <select
            id="region"
            onChange={handleRegionChange}
            value={selectedRegion || ""}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cooperative filter */}
        <div>
          <label htmlFor="coop" className="block text-sm font-medium text-gray-700 mb-1">
            Cooperative
          </label>
          <select
            id="coop"
            onChange={handleCoopChange}
            value={selectedCoop || ""}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={filteredCoops.length === 0}
          >
            <option value="">All Cooperatives</option>
            {filteredCoops.map((coop) => (
              <option key={coop.value} value={coop.value}>
                {coop.label}
              </option>
            ))}
          </select>
        </div>

        {/* Port filter */}
        <div>
          <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-1">
            Port
          </label>
          <select
            id="port"
            onChange={handlePortChange}
            value={watch("port_id")?.[0] || ""}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={filteredPorts.length === 0}
          >
            <option value="">All Ports</option>
            {filteredPorts.map((port) => (
              <option key={port.value} value={port.value}>
                {port.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
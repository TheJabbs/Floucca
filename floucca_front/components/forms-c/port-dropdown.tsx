import React, { useState, useEffect } from 'react';
import { usePort } from '@/contexts/PortContext';
import { getPorts } from '@/services/landingService';

interface Port {
  id: number;
  name: string;
}

interface PortDropdownProps {
  onPortChange?: (portId: number) => void;
  className?: string;
}

const PortDropdown: React.FC<PortDropdownProps> = ({ onPortChange, className }) => {
  const [ports, setPorts] = useState<Port[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { selectedPort, setSelectedPort } = usePort();

  useEffect(() => {
    getPorts()
      .then((ports) => {
        setPorts(ports.map((port) => ({
          id: port.port_id,
          name: port.port_name,
        })));
      })
      .catch((error) => {
        console.error("Error fetching ports:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handlePortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const portId = event.target.value;
    if (portId) {
      const numericPortId = parseInt(portId, 10);
      setSelectedPort(numericPortId);
      onPortChange?.(numericPortId);
    } else {
      setSelectedPort(null);
      onPortChange?.(0);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading ports...</p>;
  }

  return (
    <div className={`${className || ''}`}>
      <label htmlFor="port-select" className="block text-sm font-medium text-gray-700 mb-1">
        Select Port <span className="text-red-500">*</span>
      </label>
      <select
        id="port-select"
        value={selectedPort?.toString() || ""}
        onChange={handlePortChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      >
        <option value="" disabled>
          Select a port
        </option>
        {ports.map((port) => (
          <option key={port.id} value={port.id.toString()}>
            {port.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PortDropdown;
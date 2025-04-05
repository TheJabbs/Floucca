"use client";
import React from 'react';
import { usePort } from '@/contexts/PortContext';

interface Port {
  port_id: number;
  port_name: string;
}

interface PortDropdownProps {
  ports: Port[];
  onPortChange?: (portId: number) => void;
  className?: string;
}

const PortDropdown: React.FC<PortDropdownProps> = ({ ports, onPortChange, className }) => {
  const { selectedPort, setSelectedPort } = usePort();

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
          <option key={port.port_id} value={port.port_id.toString()}>
            {port.port_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PortDropdown;
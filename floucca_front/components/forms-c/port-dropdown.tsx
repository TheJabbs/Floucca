import React, { useState, useEffect } from 'react';
import Dropdown from '../dropdown/dropdown';
import { usePort } from '@/contexts/PortContext';

interface Port {
  id: string;
  name: string;
}

interface PortDropdownProps {
  onPortChange?: (portId: string) => void;
  className?: string;
}

const PortDropdown: React.FC<PortDropdownProps> = ({ onPortChange, className }) => {
  const [ports, setPorts] = useState<Port[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { selectedPort, setSelectedPort } = usePort();

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const response = await new Promise<{ data: Port[] }>((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: [
                  { id: 'port1', name: 'Port of Alexandria' },
                  { id: 'port2', name: 'Port of Beirut' },
                  { id: 'port3', name: 'Port of Tripoli' },
                ],
              }),
            1000
          )
        );
        setPorts(response.data);
      } catch (error) {
        console.error('Error fetching ports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPorts();
  }, []);

  const handlePortChange = (portId: string) => {
    setSelectedPort(portId);
    onPortChange?.(portId);
  };

  if (loading) {
    return <p>Loading ports...</p>;
  }

  const portOptions = ports.map((port) => ({
    value: port.id,
    label: port.name,
  }));

  return (
    <Dropdown
      label="Select Port"
      options={portOptions}
      selectedValue={selectedPort}
      onChange={handlePortChange}
      required={true}
    />
  );
};

export default PortDropdown;
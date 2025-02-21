// components/PortDropdown.tsx

import React, { useState, useEffect } from 'react';

interface Port {
    id: string;
    name: string;
}

interface PortDropdownProps {
    selectedPort: string;
    onPortChange: (portId: string) => void;
    className?: string;

}

const PortDropdown: React.FC<PortDropdownProps> = ({ selectedPort, onPortChange }) => {
    const [ports, setPorts] = useState<Port[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Simulate fetching ports from an API
        const fetchPorts = async () => {
            try {
                // Simulated API response (replace with actual API call)
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

    if (loading) {
        return <p>Loading ports...</p>;
    }

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Port *</label>
            <select
                value={selectedPort}
                onChange={(e) => onPortChange(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
                <option value="" disabled>
                    -- Select a Port --
                </option>
                {ports.map((port) => (
                    <option key={port.id} value={port.id}>
                        {port.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default PortDropdown;

'use client';

import React, { useEffect, useState } from 'react';
import '../../css/boat.css'

interface Gear {
    id: number;
    name: string;
}

const GearInfo: React.FC = () => {
    const [gearList, setGearList] = useState<Gear[]>([]);
    const [selectedGear, setSelectedGear] = useState<{ [key: number]: boolean }>({});
    const [gearMonths, setGearMonths] = useState<{ [key: number]: number[] }>({});

    useEffect(() => {
        // Fetch gear data from your API
        const fetchGear = async () => {
            try {
                // const response = await fetch('/api/gear'); // Replace with your API endpoint
                // const data = await response.json();
                let data : Gear[] = [{id: 45, name: "poop"}, {id: 46, name: "pee"}]
                setGearList(data);
            } catch (error) {
                console.error('Error fetching gear data:', error);
            }
        };

        fetchGear();
    }, []);

    const handleGearChange = (gearId: number) => {
        setSelectedGear((prev) => {
            const updatedSelection = { ...prev, [gearId]: !prev[gearId] };
            if (!updatedSelection[gearId]) {
                // If the gear is unchecked, remove its associated months
                setGearMonths((prevMonths) => {
                    const { [gearId]: _, ...updatedMonths } = prevMonths;
                    return updatedMonths;
                });
            }
            return updatedSelection;
        });
    };

    const handleMonthChange = (gearId: number, month: number) => {
        setGearMonths((prev) => {
            const updatedMonths = { ...prev };
            if (!updatedMonths[gearId]) {
                updatedMonths[gearId] = [];
            }
            if (updatedMonths[gearId].includes(month)) {
                updatedMonths[gearId] = updatedMonths[gearId].filter((m) => m !== month);
            } else {
                updatedMonths[gearId].push(month);
            }
            return updatedMonths;
        });
    };

    return (
        <div className="gear-info">
            <h2 className="text-xl font-bold mb-4">Gear Information</h2>
            {gearList.map((gear) => (
                <div key={gear.id} className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedGear[gear.id] || false}
                            onChange={() => handleGearChange(gear.id)}
                            className="mr-2"
                        />
                        {gear.name}
                    </label>
                    {selectedGear[gear.id] && (
                        <div className="ml-6 mt-2 grid grid-cols-4 gap-2">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                <label key={month} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={gearMonths[gear.id]?.includes(month) || false}
                                        onChange={() => handleMonthChange(gear.id, month)}
                                        className="mr-2"
                                    />
                                    Month {month}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default GearInfo;

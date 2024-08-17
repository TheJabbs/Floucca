'use client';

import React, { useState, useEffect } from 'react';
import FormInput from '../utils/form-input';

interface BoatInfoProps {
    required?: boolean;
    onChange: (boatData: {
        ownerName: string;
        registrationNumber: string;
        boatName: string;
        horsePower: number;
        length: number;
        capacity: number;
    }) => void;
}

const BoatInfo: React.FC<BoatInfoProps> = ({ required = false, onChange }) => {
    const [boatData, setBoatData] = useState({
        ownerName: '',
        registrationNumber: '',
        boatName: '',
        horsePower: 0,
        length: 0,
        capacity: 0,
    });

    useEffect(() => {
        onChange(boatData);
    }, [boatData, onChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBoatData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="boat-info">
            <h2 className="text-xl font-bold mb-4">Boat Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Boat Owner Name"
                    name="ownerName"
                    required={required}
                    placeholder="Enter owner's name"
                    value={boatData.ownerName}
                    onChange={handleChange}
                />
                <FormInput
                    label="Boat Registration Number"
                    name="registrationNumber"
                    required={required}
                    placeholder="Enter registration number"
                    value={boatData.registrationNumber}
                    onChange={handleChange}
                />
                <FormInput
                    label="Boat Name"
                    name="boatName"
                    required={required}
                    placeholder="Enter boat name"
                    value={boatData.boatName}
                    onChange={handleChange}
                />
                <FormInput
                    label="Boat Horse Power"
                    name="horsePower"
                    required={required}
                    placeholder="Enter horse power"
                    type="number"
                    value={boatData.horsePower.toString()}
                    onChange={handleChange}
                />
                <FormInput
                    label="Boat Length (in meters)"
                    name="length"
                    required={required}
                    placeholder="Enter length"
                    type="number"
                    value={boatData.length.toString()}
                    onChange={handleChange}
                />
                <FormInput
                    label="Boat Capacity (in kg)"
                    name="capacity"
                    required={required}
                    placeholder="Enter capacity"
                    type="number"
                    value={boatData.capacity.toString()}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default BoatInfo;

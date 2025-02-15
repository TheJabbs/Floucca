'use client';

import React, { useState, useEffect } from 'react';
import FormInput from '../utils/form-input';

interface BoatInfoProps {
    required?: boolean;
    onChange: (boatData: {
        fleet_owner: string;
        fleet_registration: number;
        fleet_size: number;
        fleet_crew: number;
        fleet_max_weight: number;
        fleet_length: number;
    }) => void;
}

const BoatInfo: React.FC<BoatInfoProps> = ({ required = false, onChange }) => {
    const [boatData, setBoatData] = useState({
        fleet_owner: '',
        fleet_registration: 0,
        fleet_size: 0,
        fleet_crew: 0,
        fleet_max_weight: 0,
        fleet_length: 0,
    });

    useEffect(() => {
        onChange(boatData);
    }, [boatData, onChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBoatData((prev) => ({
            ...prev,
            [name]: name === 'fleet_owner' ? value : Number(value),
        }));
    };

    return (
        <div className="boat-info">
            <h2 className="text-xl font-bold mb-4">Boat Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Boat Owner Name"
                    name="fleet_owner"
                    required={required}
                    placeholder="Enter owner's name"
                    value={boatData.fleet_owner}
                    onChange={handleChange}
                />
                <FormInput
                    label="Boat Registration Number"
                    name="fleet_registration"
                    required={required}
                    placeholder="Enter registration number"
                    type="number"
                    value={boatData.fleet_registration.toString()}
                    onChange={handleChange}
                />
                <FormInput
                    label="Boat Fleet Size"
                    name="fleet_size"
                    required={required}
                    placeholder="Enter fleet size"
                    type='number'
                    value={boatData.fleet_size.toString()}
                    onChange={handleChange}
                />
                <FormInput
                    label="Fleet Crew Count"
                    name="fleet_crew"
                    required={required}
                    placeholder="Enter crew count"
                    type="number"
                    value={boatData.fleet_crew.toString()}
                    onChange={handleChange}
                />
                <FormInput
                    label="Boat Maximum Weight (in Kg)"
                    name="fleet_max_weight"
                    required={required}
                    placeholder="Enter max weight"
                    type="number"
                    value={boatData.fleet_max_weight.toString()}
                    onChange={handleChange}
                />
                <FormInput
                    label="Boat Length (meters)"
                    name="fleet_length"
                    required={required}
                    placeholder="Enter length"
                    type="number"
                    value={boatData.fleet_length.toString()}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default BoatInfo;

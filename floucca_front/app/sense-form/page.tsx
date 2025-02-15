'use client'

import React, {useState} from 'react';
import BoatInfo from "@/components/forms-c/boat-form";
import GearInfo from "@/components/forms-c/gear-form";

function Page() {
    const [boatData, setBoatData] = useState({
        ownerName: '',
        registrationNumber: '',
        boatName: '',
        horsePower: 0,
        length: 0,
        capacity: 0,
    });

    const [gearData, setGearData] = useState<{ gearId: number; months: number[] }[]>([]);

    const handleBoatChange = (data: typeof boatData) => {
        setBoatData(data);
    };

    const handleGearChange = (data: typeof gearData) => {
        setGearData(data);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (gearData.length === 0) {
            alert('Please add at least one gear entry');
            return;
          }

        // Prepare the combined form data for submission
        const FleetSensesFormDTO = {
            FleetSensesFormDTO: {
                boatInfo: boatData,
                gearData: gearData,
            }
        };

        console.log('Submitting form data:', FleetSensesFormDTO);
        // fetch('/api/submit', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(formData),
        // });
    };

    return (
        <div className="container mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <BoatInfo required={true} onChange={handleBoatChange}/>
                <GearInfo onChange={handleGearChange}/>
                <button
                    type="submit"
                    className="submit-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Submit
                </button>
            </form>
        </div>);
}

export default Page;
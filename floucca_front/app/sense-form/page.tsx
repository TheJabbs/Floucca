'use client'

import React, {useState} from 'react';
import BoatInfo from "@/components/forms-c/boat-form";
import GearInfo from "@/components/forms-c/gear-form";
import MapWithMarkers from "@/components/forms-c/MapWithMarker";



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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare the combined form data for submission
        const formData = {
            boatInfo: boatData,
            gearData: gearData,
        };

        console.log('Submitting form data:', formData);

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
                <div className="container mx-auto p-6">
                    <MapWithMarkers/>
                    <BoatInfo required={true} onChange={handleBoatChange}/>
                </div>
                    <GearInfo/>
                    <button
                        type="submit"
                        className="submit-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Submit
                    </button>

            </form>
        </div>
);
}

export default Page;
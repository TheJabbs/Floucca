import axios from "axios";

export interface Gear {
    gear_code: number;
    gear_name: string;
    equipment_id: string;
    equipment_name: string;
}

const API_BASE_URL = "http://localhost:4000/api/dev/gear";  

// Function to fetch all gears from the backend
export const getAllGears = async (): Promise<Gear[]> => {
    try {
        const response = await axios.get<Gear[]>(`${API_BASE_URL}/all/gear`);
        return response.data;
    } catch (error) {
        console.error("Error fetching gears:", error);
        throw error;
    }
};

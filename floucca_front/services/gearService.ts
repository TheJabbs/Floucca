import { apiClient, handleApiError } from "./apiClient";

export interface Gear {
  gear_code: number;
  gear_name: string;
  equipment_id: string;
  equipment_name: string;
}

export interface CreateGearDto {
  gear_code: number;
  gear_name: string;
  equipment_id: string;
  equipment_name: string;
}

export interface UpdateGearDto {
  gear_name: string;
  equipment_id: string;
  equipment_name: string;
}

// Fetch all gears
export const getGears = async (): Promise<Gear[]> => {
  try {
    const response = await apiClient.get("/api/dev/gear/all/gear");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching gears");
  }
};

// Get gear by code
export const getGearByCode = async (gearCode: number): Promise<Gear> => {
  try {
    const response = await apiClient.get(`/api/dev/gear/gear/${gearCode}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `fetching gear ${gearCode}`);
  }
};

// Create a new gear
export const createGear = async (gear: CreateGearDto): Promise<Gear> => {
  try {
    const response = await apiClient.post("/api/dev/gear/create/gear", gear);
    return response.data;
  } catch (error) {
    return handleApiError(error, "creating gear");
  }
};

// Update an existing gear
export const updateGear = async (gearCode: number, gear: UpdateGearDto): Promise<Gear> => {
  try {
    const response = await apiClient.put(`/api/dev/gear/update/gear/${gearCode}`, gear);
    return response.data;
  } catch (error) {
    return handleApiError(error, `updating gear ${gearCode}`);
  }
};

// Delete a gear
export const deleteGear = async (gearCode: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/dev/gear/delete/gear/${gearCode}`);
  } catch (error) {
    return handleApiError(error, `deleting gear ${gearCode}`);
  }
};
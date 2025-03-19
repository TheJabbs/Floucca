import { apiClient, handleApiError } from "./apiClient";

export interface Port {
  port_id: number;
  port_name: string;
  coop_code: number;
}

// Fetch all ports
export const getPorts = async (): Promise<Port[]> => {
  try {
    const response = await apiClient.get("/ports");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching ports");
  }
};

// Get port by ID
export const getPortById = async (portId: number): Promise<Port> => {
  try {
    const response = await apiClient.get(`/ports/${portId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `fetching port ${portId}`);
  }
};
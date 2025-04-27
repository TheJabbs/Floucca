import { apiClient, handleApiError, ApiResponse } from "./apiClient";

export interface Port {
  port_id: number;
  port_name: string;
  coop_code: number;
}

export interface PortDetailed {
  port_id: number;
  port_name: string;
  coop: {
    coop_code: number;
    coop_name: string;
    region: {
      region_code: number;
      region_name: string;
    };
  };
}

// Fetch all ports
export const getPorts = async (): Promise<Port[]> => {
  try {
    const response = await apiClient.get("/api/dev/ports");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching ports");
  }
};

// Fetch detailed ports with coop and region information
export const getDetailedPorts = async (): Promise<PortDetailed[]> => {
  try {
    const response = await apiClient.get("/api/dev/ports/detailed");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching detailed ports");
  }
};

// Get port by ID
export const getPortById = async (portId: number): Promise<Port> => {
  try {
    const response = await apiClient.get(`/api/dev/ports/${portId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `fetching port ${portId}`);
  }
};

// Create a new port
export const createPort = async (portData: { port_name: string; coop_code: number }): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post("/api/dev/ports", portData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "creating port");
  }
};

// Update an existing port
export const updatePort = async (portId: number, portData: { port_name: string; coop_code: number }): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put(`/api/dev/ports/${portId}`, portData);
    return response.data;
  } catch (error) {
    return handleApiError(error, `updating port ${portId}`);
  }
};

// Delete a port
export const deletePort = async (portId: number): Promise<ApiResponse> => {
  try {
    const response = await apiClient.delete(`/api/dev/ports/${portId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `deleting port ${portId}`);
  }
};
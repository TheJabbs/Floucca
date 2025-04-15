import { apiClient, handleApiError } from "./apiClient";

export interface Role {
  role_id: number;
  role_code: string;
  role_name: string;
}

// Fetch all roles
export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await apiClient.get("/roles/all");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching roles");
  }
};

// Get role by ID
export const getRoleById = async (roleId: number): Promise<Role> => {
  try {
    const response = await apiClient.get(`/roles/${roleId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `fetching role ${roleId}`);
  }
};

// Create new role
export const createRole = async (roleData: { role_code: string; role_name: string }): Promise<Role> => {
  try {
    const response = await apiClient.post("/roles/create", roleData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "creating role");
  }
};

// Update role
export const updateRole = async (roleId: number, roleData: { role_code: string; role_name: string }): Promise<Role> => {
  try {
    const response = await apiClient.put(`/roles/update/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    return handleApiError(error, `updating role ${roleId}`);
  }
};

// Delete role
export const deleteRole = async (roleId: number): Promise<Role> => {
  try {
    const response = await apiClient.delete(`/roles/delete/${roleId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `deleting role ${roleId}`);
  }
};
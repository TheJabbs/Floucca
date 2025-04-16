import { apiClient, handleApiError, ApiResponse } from "./apiClient";

export interface User {
  user_id: number;
  user_fname: string;
  user_lname: string;
  user_email?: string;
  user_phone?: string;
  user_pass: string;
  last_login?: string;
  creation_time?: string;
  roles?: Array<{ role_id: number; role_name: string; role_code: string }>;
  coops?: Array<{ coop_code: number; coop_name: string }>;
}

export interface CreateUserDto {
  user_fname: string;
  user_lname: string;
  user_email?: string;
  user_phone?: string;
  user_pass: string;
  coop_codes: number[];
  role_ids: number[];
}

export interface UpdateUserDto {
  user_fname?: string;
  user_lname?: string;
  user_email?: string;
  user_phone?: string;
  user_pass?: string;
  coop_codes?: number[];
  role_ids?: number[];
}

const processUserData = (userData: any): User => {
  const user: User = {
    user_id: userData.user_id,
    user_fname: userData.user_fname,
    user_lname: userData.user_lname,
    user_email: userData.user_email,
    user_phone: userData.user_phone,
    user_pass: userData.user_pass,
    last_login: userData.last_login,
    creation_time: userData.creation_time,
    roles: [],
    coops: []
  };

  if (userData.user_role && Array.isArray(userData.user_role)) {
    user.roles = userData.user_role.map((ur: any) => ({
      role_id: ur.roles.role_id,
      role_name: ur.roles.role_name,
      role_code: ur.roles.role_code
    }));
  }

  if (userData.user_coop && Array.isArray(userData.user_coop)) {
    user.coops = userData.user_coop.map((uc: any) => ({
      coop_code: uc.coop.coop_code,
      coop_name: uc.coop.coop_name
    }));
  }

  return user;
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get("/users/all");
    return response.data.map(processUserData);
  } catch (error) {
    return handleApiError(error, "fetching users");
  }
};

// Get user by ID
export const getUserById = async (userId: number): Promise<User> => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return processUserData(response.data);
  } catch (error) {
    return handleApiError(error, `fetching user ${userId}`);
  }
};

// Create new user
export const createUser = async (userData: CreateUserDto): Promise<ApiResponse<{ user_id: number }>> => {
  try {
    const response = await apiClient.post("/users/admin-create", userData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "creating user");
  }
};

// Update user
export const updateUser = async (userId: number, userData: UpdateUserDto): Promise<ApiResponse<{ user_id: number }>> => {
  try {
    const response = await apiClient.put(`/users/update/${userId}`, userData);
    return response.data;
  } catch (error) {
    return handleApiError(error, `updating user ${userId}`);
  }
};

// Delete user
export const deleteUser = async (userId: number): Promise<User> => {
  try {
    const response = await apiClient.delete(`/users/delete/${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `deleting user ${userId}`);
  }
};
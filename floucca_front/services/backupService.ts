import { apiClient, handleApiError, ApiResponse } from "./apiClient";

export interface Backup {
  backup_id: number;
  backup_content: string;
  backup_date: Date;
}

export interface BackupInfo {
  backup_id: number;
  backup_date: string;
}

export const getBackupInfo = async (): Promise<BackupInfo[]> => {
  try {
    const response = await apiClient.get("/api/dev/backup/info");
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching backup info");
  }
};

export const createBackup = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.get("/api/dev/backup/up");
    return response.data;
  } catch (error) {
    return handleApiError(error, "creating backup");
  }
};

export const getBackupById = async (backupId: number): Promise<Backup> => {
  try {
    const response = await apiClient.get(`/api/dev/backup/${backupId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetching backup");
  }
};

export const softRestore = async (backupId: number): Promise<ApiResponse> => {
  try {
    const response = await apiClient.get(`/api/dev/backup/softRestore/${backupId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "soft restoring from backup");
  }
};

export const hardRestore = async (backupId: number): Promise<ApiResponse> => {
  try {
    const response = await apiClient.get(`/api/dev/backup/fullRestore/${backupId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "hard restoring from backup");
  }
};

export const deleteBackup = async (backupId: number): Promise<Backup> => {
  try {
    const response = await apiClient.delete(`/api/dev/backup/${backupId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "deleting backup");
  }
};
"use client";
import React, { useState, useEffect } from "react";
import { 
  DownloadCloud, 
  RefreshCw, 
  AlertTriangle, 
  Check, 
  X, 
  Info
} from "lucide-react";
import { 
  getBackupInfo, 
  createBackup, 
  getBackupById,
  softRestore, 
  hardRestore, 
  BackupInfo 
} from "@/services/backupService";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  type: NotificationType;
  message: string;
}

const BackupManagement = () => {
  // backups list
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // viewing a specific backup
  const [selectedBackupId, setSelectedBackupId] = useState<number | null>(null);
  const [selectedBackupContent, setSelectedBackupContent] = useState<string>("");
  const [viewingBackup, setViewingBackup] = useState(false);
  const [isLoadingBackup, setIsLoadingBackup] = useState(false);
  
  // confirming actions
  const [showConfirmHardRestore, setShowConfirmHardRestore] = useState<number | null>(null);
  const [showConfirmSoftRestore, setShowConfirmSoftRestore] = useState<number | null>(null);
  
  // for notifications
  const [notification, setNotification] = useState<Notification | null>(null);
  
  // backup creation
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  // Fetch backups info
  const fetchBackups = async () => {
    try {
      setIsLoading(true);
      const data = await getBackupInfo();
      setBackups(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load backups");
      console.error("Error fetching backups:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  // Create new backup
  const handleCreateBackup = async () => {
    try {
      setIsCreatingBackup(true);
      await createBackup();
      await fetchBackups();
      showNotification("success", "Backup created successfully");
    } catch (err: any) {
      showNotification("error", `Failed to create backup: ${err.message}`);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  // View backup content
  const handleViewBackup = async (backupId: number) => {
    try {
      setIsLoadingBackup(true);
      setSelectedBackupId(backupId);
      const backup = await getBackupById(backupId);
      setSelectedBackupContent(backup.backup_content);
      setViewingBackup(true);
    } catch (err: any) {
      showNotification("error", `Failed to load backup: ${err.message}`);
    } finally {
      setIsLoadingBackup(false);
    }
  };

  // Perform soft restore
  const handleSoftRestore = async (backupId: number) => {
    try {
      const result = await softRestore(backupId);
      showNotification("success", "Soft restore completed successfully");
      fetchBackups();
    } catch (err: any) {
      showNotification("error", `Soft restore failed: ${err.message}`);
    } finally {
      setShowConfirmSoftRestore(null);
    }
  };

  // Perform hard restore
  const handleHardRestore = async (backupId: number) => {
    try {
      const result = await hardRestore(backupId);
      showNotification("success", "Hard restore (rollback) completed successfully");
      fetchBackups();
    } catch (err: any) {
      showNotification("error", `Hard restore failed: ${err.message}`);
    } finally {
      setShowConfirmHardRestore(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Show notification
  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Close backup viewer
  const closeBackupViewer = () => {
    setViewingBackup(false);
    setSelectedBackupId(null);
    setSelectedBackupContent("");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Backup Management</h1>
        <button
          onClick={handleCreateBackup}
          disabled={isCreatingBackup}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center disabled:bg-blue-300"
        >
          {isCreatingBackup ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Creating Backup...
            </>
          ) : (
            <>
              <DownloadCloud className="w-4 h-4 mr-2" /> Create New Backup
            </>
          )}
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : notification.type === "error"
              ? "bg-red-50 border border-red-200 text-red-800"
              : notification.type === "warning"
              ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
              : "bg-blue-50 border border-blue-200 text-blue-800"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" && <Check className="w-5 h-5 mr-2" />}
            {notification.type === "error" && <X className="w-5 h-5 mr-2" />}
            {notification.type === "warning" && <AlertTriangle className="w-5 h-5 mr-2" />}
            {notification.type === "info" && <Info className="w-5 h-5 mr-2" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          {error}
          <button
            onClick={fetchBackups}
            className="ml-4 text-blue-600 underline"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Backups table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backups.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No backups found
                    </td>
                  </tr>
                ) : (
                  backups.map((backup) => (
                    <tr key={backup.backup_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(backup.backup_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {showConfirmSoftRestore === backup.backup_id ? (
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-gray-600 mr-2">Confirm soft restore?</span>
                            <button
                              onClick={() => handleSoftRestore(backup.backup_id)}
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-md hover:bg-green-200"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setShowConfirmSoftRestore(null)}
                              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200"
                            >
                              No
                            </button>
                          </div>
                        ) : showConfirmHardRestore === backup.backup_id ? (
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-red-600 mr-2 font-bold">WARNING: This will delete all current data. Proceed?</span>
                            <button
                              onClick={() => handleHardRestore(backup.backup_id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setShowConfirmHardRestore(null)}
                              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewBackup(backup.backup_id)}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200"
                            >
                              View
                            </button>
                            <button
                              onClick={() => setShowConfirmSoftRestore(backup.backup_id)}
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-md hover:bg-green-200"
                              title="Restore data without dropping tables"
                            >
                              Soft Restore
                            </button>
                            <button
                              onClick={() => setShowConfirmHardRestore(backup.backup_id)}
                              className="bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200"
                              title="Drop all tables and restore from backup"
                            >
                              Hard Restore
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Backup Content Viewer Modal */}
          {viewingBackup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Backup Content
                  </h2>
                  <button
                    onClick={closeBackupViewer}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {isLoadingBackup ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center">
                      <Info className="w-5 h-5 text-blue-500 mr-2" />
                      <p className="text-sm">
                        This is the SQL backup content. You can restore this backup using the Soft Restore or Hard Restore options.
                      </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-1 overflow-auto">
                      <pre className="text-xs whitespace-pre-wrap font-mono text-gray-800 max-h-96">
                        {selectedBackupContent}
                      </pre>
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          closeBackupViewer();
                          setShowConfirmSoftRestore(selectedBackupId);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Soft Restore
                      </button>
                      <button
                        onClick={() => {
                          closeBackupViewer();
                          setShowConfirmHardRestore(selectedBackupId);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                      >
                        Hard Restore
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BackupManagement;
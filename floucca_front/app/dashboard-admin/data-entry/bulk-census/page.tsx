"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Filter, Plus, X } from "lucide-react";
import { useFormsData } from "@/contexts/FormDataContext";
import Notification from "@/components/utils/notification";
import ReusableDataTable from "@/components/admin/table";
import { 
  fetchGearReport, 
  submitBulkEntries,
  GearReport,
  BulkEntryPayload
} from "@/services/fleetBulkService";

interface FilterFormData {
  year: string;
  month: string;
  portId: number;
}

interface BulkEntryFormData {
  numberOfGears: number;
}

const BulkEntriesPage = () => {
  const { ports } = useFormsData();

  const [reportData, setReportData] = useState<GearReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGear, setSelectedGear] = useState<GearReport | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const {
    control: filterControl,
    handleSubmit: handleFilterSubmit,
    watch: watchFilter,
    formState: { errors: filterErrors },
  } = useForm<FilterFormData>({
    defaultValues: {
      year: currentYear.toString(),
      month: new Date().getMonth() + 1 + "",
      portId: 0,
    },
  });

  const {
    register: registerBulk,
    handleSubmit: handleBulkSubmit,
    reset: resetBulkForm,
    formState: { errors: bulkErrors },
  } = useForm<BulkEntryFormData>({
    defaultValues: {
      numberOfGears: undefined,
    },
  });

  const filterValues = watchFilter();

  const tableColumns = [
    { key: "gear_name", header: "Gear Name" },
    { key: "freq", header: "Number of Gears" },
  ];

  const fetchReportData = async (data: FilterFormData) => {
    if (!data.portId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const gearReport = await fetchGearReport(
        data.year,
        data.month,
        data.portId
      );
      
      setReportData(gearReport);
    } catch (err: any) {
      console.error("Error fetching report:", err);
      setError(err.message || "Failed to fetch gear usage data");
      setReportData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitBulkEntry = async (data: BulkEntryFormData) => {
    if (!selectedGear) return;
    
    try {
      setIsLoading(true);
      
      const payload: BulkEntryPayload = {
        formDto: {
          user_id: 1,
          port_id: filterValues.portId,
          fisher_name: "BULK ENTRY",
          period_date: `${filterValues.year}-${filterValues.month.padStart(2, '0')}-01`,
        },
        gearUsageDto: {
          gear_code: selectedGear.gear_code,
          months: [parseInt(filterValues.month)],
        },
        numberOfGears: data.numberOfGears,
      };

      const response = await submitBulkEntries(payload);

      setNotification({
        type: "success",
        message: `Successfully added ${data.numberOfGears} ${selectedGear.gear_name} entries`,
      });

      await fetchReportData(filterValues);
      
      setShowModal(false);
      resetBulkForm();
      setSelectedGear(null);
    } catch (err: any) {
      console.error("Error submitting bulk entry:", err);
      setNotification({
        type: "error",
        message: err.message || "Failed to add bulk entries",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onFilterSubmit = (data: FilterFormData) => {
    fetchReportData(data);
  };

  const handleAddGear = (gear: GearReport) => {
    setSelectedGear(gear);
    setShowModal(true);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetBulkForm();
    setSelectedGear(null);
  };

  const renderActionButton = (_: any, item: GearReport) => (
    <button
      onClick={() => handleAddGear(item)}
      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
    >
      <Plus className="h-5 w-5" />
    </button>
  );

  const columnsWithActions = [
    ...tableColumns,
    {
      key: "actions",
      header: "Actions",
      render: renderActionButton,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Bulk Entries Management</h1>
        <p className="text-gray-600">
          View gear usage and add multiple entries at once
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-medium">Filter Gear Report</h2>
        </div>

        <form onSubmit={handleFilterSubmit(onFilterSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <Controller
                name="year"
                control={filterControl}
                rules={{ required: "Year is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                )}
              />
              {filterErrors.year && (
                <p className="mt-1 text-sm text-red-600">{filterErrors.year.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <Controller
                name="month"
                control={filterControl}
                rules={{ required: "Month is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select month</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                )}
              />
              {filterErrors.month && (
                <p className="mt-1 text-sm text-red-600">
                  {filterErrors.month.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Port
              </label>
              <Controller
                name="portId"
                control={filterControl}
                rules={{ required: "Port is required", min: { value: 1, message: "Please select a port" } }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  >
                    <option value={0}>Select port</option>
                    {ports.map((port) => (
                      <option key={port.port_id} value={port.port_id}>
                        {port.port_name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {filterErrors.portId && (
                <p className="mt-1 text-sm text-red-600">
                  {filterErrors.portId.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
              ) : (
                <Filter className="w-4 h-4 mr-2" />
              )}
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Gear Usage Report</h2>
          <p className="text-sm text-gray-500">
            Click the + button to add bulk entries for a specific gear
          </p>
        </div>

        <ReusableDataTable
          data={reportData}
          columns={columnsWithActions}
          keyExtractor={(item) => item.gear_code}
          isLoading={isLoading}
          error={error}
          noDataMessage="No data found for the selected filters. Please adjust your filter criteria or apply them."
        />
      </div>

      {/* Bulk Entry Modal */}
      {showModal && selectedGear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Bulk Entries</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">
                Adding bulk entries for <span className="font-semibold">{selectedGear.gear_name}</span>
              </p>
              <p className="text-sm text-gray-500">
                Current count: {selectedGear.freq}
              </p>
            </div>

            <form onSubmit={handleBulkSubmit(submitBulkEntry)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Gears to Add
                </label>
                <input
                  type="number"
                  {...registerBulk("numberOfGears", {
                    required: "Please enter a number",
                    min: { value: 1, message: "Minimum value is 1" },
                    max: { value: 100, message: "Maximum value is 100" },
                    valueAsNumber: true,
                  })}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter number (1-100)"
                />
                {bulkErrors.numberOfGears && (
                  <p className="mt-1 text-sm text-red-600">
                    {bulkErrors.numberOfGears.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Add Entries"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          isVisible={!!notification}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

export default BulkEntriesPage;
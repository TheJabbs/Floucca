"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    ChevronDown,
    ChevronUp,
    Calendar,
    Edit,
    Save,
    X,
    RefreshCw,
    Filter,
    AlertTriangle,
    PlusCircle,
} from "lucide-react";
import {
    getAllPeriodsWithActiveDays,
    updatePeriodStatus,
    updateActiveDay,
    getDaysInMonthByDate,
    formatDate,
    createNewPeriod,
    formatDateForApi,
    PeriodWithActiveDays,
    ActiveDay,
    Period,
} from "@/services/periodService";
import { getPorts } from "@/services/portService";
import { getGears } from "@/services/gearService";

const STATUS_COLORS = {
    B: "bg-blue-100 text-blue-800 border-blue-300",
    R: "bg-green-100 text-green-800 border-green-300",
    F: "bg-purple-100 text-purple-800 border-purple-300",
    H: "bg-gray-100 text-gray-800 border-gray-300",
    A: "bg-amber-100 text-amber-800 border-amber-300",
};

const STATUS_LABELS = {
    B: "Blocked",
    R: "Released",
    F: "Finalized",
    H: "History",
    A: "Active",
};

const PeriodManagement = () => {
    const [periods, setPeriods] = useState<PeriodWithActiveDays[]>([]);
    const [expandedPeriod, setExpandedPeriod] = useState<string | null>(null);
    const [editingStatus, setEditingStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ports, setPorts] = useState<any[]>([]);
    const [gears, setGears] = useState<any[]>([]);
    const [selectedPort, setSelectedPort] = useState("");
    const [selectedGear, setSelectedGear] = useState("");
    const [editingActiveDays, setEditingActiveDays] = useState<
        Record<number, string>
    >({});
    const [isSaving, setIsSaving] = useState(false);
    const [showCreatePeriodModal, setShowCreatePeriodModal] = useState(false);
    const [newPeriodDate, setNewPeriodDate] = useState<string>("");
    const [isCreatingPeriod, setIsCreatingPeriod] = useState(false);

    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            period_status: "",
        },
    });

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [periodsData, portsData, gearsData] = await Promise.all([
                getAllPeriodsWithActiveDays(),
                getPorts(),
                getGears(),
            ]);

            // sort periods by date
            const sortedPeriods = periodsData.sort(
                (a, b) =>
                    new Date(b.period.period_date).getTime() -
                    new Date(a.period.period_date).getTime()
            );

            setPeriods(sortedPeriods);
            setPorts(portsData);
            setGears(gearsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load data");
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

  // Initialize new period date on modal open
  useEffect(() => {
    if (showCreatePeriodModal) {
      // Set default date to next month (1st day)
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      setNewPeriodDate(formatDateForApi(nextMonth));
    }
  }, [showCreatePeriodModal]);

  const togglePeriod = (periodDate: string) => {
    if (expandedPeriod === periodDate) {
      setExpandedPeriod(null);
    } else {
      setExpandedPeriod(periodDate);
    }
  };

  const startEditStatus = (period: Period) => {
    setEditingStatus(period.period_date);
    setValue("period_status", period.period_status);
  };

  const cancelEditStatus = () => {
    setEditingStatus(null);
  };

  // Handle creating a new period
  const handleCreatePeriod = async () => {
    if (!newPeriodDate) {
      setError("Please select a valid date for the new period");
      return;
    }

    try {
      setIsCreatingPeriod(true);
      setError(null);

      await createNewPeriod(newPeriodDate);
      setShowCreatePeriodModal(false);

      // Refresh the periods list
      await fetchData();

      // Reset the form
      setNewPeriodDate("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create new period"
      );
      console.error("Error creating new period:", err);
    } finally {
      setIsCreatingPeriod(false);
    }
  };

  //  submit status update
  const onSubmitStatusUpdate = async (data: { period_status: string }) => {
    if (!editingStatus) return;

    try {
      setIsSaving(true);
      await updatePeriodStatus(editingStatus, data.period_status);

      // update local state
      setPeriods(
        periods.map((p) =>
          p.period.period_date === editingStatus
            ? {
                ...p,
                period: {
                  ...p.period,
                  period_status: data.period_status,
                },
              }
            : p
        )
      );
      setEditingStatus(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update period status"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const updateActiveDayField = (activeId: number, newValue: string) => {
    setEditingActiveDays({
      ...editingActiveDays,
      [activeId]: newValue,
    });
  };

  const saveActiveDayUpdate = async (activeId: number) => {
    try {
      setIsSaving(true);

      const newValue = parseInt(editingActiveDays[activeId]);
      const currentPeriod = periods.find((p) =>
        p.activeDays.some((a) => a.active_id === activeId)
      );
      const maxDays = currentPeriod
        ? getDaysInMonthByDate(currentPeriod.period.period_date)
        : 31;
      if (isNaN(newValue) || newValue < 0 || newValue > maxDays) {
        throw new Error(
          `Invalid active days value: must be between 0 and ${maxDays}`
        );
      }
      await updateActiveDay(activeId, newValue);

      // update local state
      setPeriods(
        periods.map((p) => ({
          ...p,
          activeDays: p.activeDays.map((a) =>
            a.active_id === activeId ? { ...a, active_days: newValue } : a
          ),
        }))
      );
      // clear editing state for this entry
      const updatedEditingActiveDays = { ...editingActiveDays };
      delete updatedEditingActiveDays[activeId];
      setEditingActiveDays(updatedEditingActiveDays);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update active days"
      );
    } finally {
      setIsSaving(false);
    }
  };

    // filter active days table
    const getFilteredActiveDays = (activeDays: ActiveDay[]) => {
        return activeDays.filter((day) => {
            const portMatch = selectedPort
                ? day.port_id === parseInt(selectedPort)
                : true;
            const gearMatch = selectedGear
                ? day.gear_code === parseInt(selectedGear)
                : true;
            return portMatch && gearMatch;
        });
    };

    const resetFilters = () => {
        setSelectedPort("");
        setSelectedGear("");
    };

    const getPortName = (portId: number) => {
        const port = ports.find((p) => p.port_id === portId);
        return port ? port.port_name : `Port ${portId}`;
    };

    const getGearName = (gearId: number) => {
        const gear = gears.find((g) => g.gear_code === gearId);
        return gear ? gear.gear_name : `Gear ${gearId}`;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );
    }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Period Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreatePeriodModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            disabled={isCreatingPeriod}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Period
          </button>
          <button
            onClick={fetchData}
            className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg flex items-center"
            disabled={isLoading || isSaving}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </button>
        </div>
      </div>

      {/* New Period Modal */}
      {showCreatePeriodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Period</h2>
            <p className="text-gray-600 mb-4">
              Select a date for the new period. This will create a new period
              for the chosen month.
            </p>

            <div className="mb-4">
              <label
                htmlFor="new-period-date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Period Date (First day of month)
              </label>
              <input
                id="new-period-date"
                type="date"
                className="w-full px-3 py-2 border rounded-md"
                value={newPeriodDate}
                onChange={(e) => setNewPeriodDate(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                The period will be created for the month of the selected date.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreatePeriodModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isCreatingPeriod}
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePeriod}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                disabled={isCreatingPeriod}
              >
                {isCreatingPeriod ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Period
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* error msg */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {periods.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center text-gray-600">
          No periods found.
        </div>
      ) : (
        <div className="space-y-4">
          {periods.map((period) => (
            <div
              key={period.period.period_date}
              className="border rounded-lg overflow-hidden bg-white shadow-sm"
            >
              {/* period header */}
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => togglePeriod(period.period.period_date)}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" />
                  <h3 className="font-semibold text-lg">
                    {formatDate(period.period.period_date)}
                  </h3>
                  <div
                    className={`px-3 py-1 rounded-full text-sm border ${
                      STATUS_COLORS[
                        period.period
                          .period_status as keyof typeof STATUS_COLORS
                      ] || "bg-gray-100"
                    }`}
                  >
                    {STATUS_LABELS[
                      period.period.period_status as keyof typeof STATUS_LABELS
                    ] || period.period.period_status}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {editingStatus === period.period.period_date ? (
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Controller
                        name="period_status"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="border rounded-md p-1 text-sm"
                            disabled={isSaving}
                          >
                            <option value="B">Blocked</option>
                            <option value="R">Released</option>
                            <option value="F">Finalized</option>
                            <option value="H">History</option>
                            <option value="A">Active</option>
                          </select>
                        )}
                      />
                      <button
                        onClick={handleSubmit(onSubmitStatusUpdate)}
                        className="p-1 text-green-600 hover:text-green-800 disabled:text-gray-400"
                        disabled={isSaving}
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelEditStatus();
                        }}
                        className="p-1 text-red-600 hover:text-red-800 disabled:text-gray-400"
                        disabled={isSaving}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditStatus(period.period);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                      disabled={isSaving}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {expandedPeriod === period.period.period_date ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>

              {/* expanded content */}
              {expandedPeriod === period.period.period_date && (
                <div className="border-t p-4">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Active Days Management</h4>
                      <div className="flex gap-3">
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`port-filter-${period.period.period_date}`}
                            className="text-sm font-medium"
                          >
                            Port:
                          </label>
                          <select
                            id={`port-filter-${period.period.period_date}`}
                            className="border rounded p-1 text-sm"
                            value={selectedPort}
                            onChange={(e) => setSelectedPort(e.target.value)}
                          >
                            <option value="">All Ports</option>
                            {ports.map((port) => (
                              <option key={port.port_id} value={port.port_id}>
                                {port.port_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`gear-filter-${period.period.period_date}`}
                            className="text-sm font-medium"
                          >
                            Gear:
                          </label>
                          <select
                            id={`gear-filter-${period.period.period_date}`}
                            className="border rounded p-1 text-sm"
                            value={selectedGear}
                            onChange={(e) => setSelectedGear(e.target.value)}
                          >
                            <option value="">All Gears</option>
                            {gears.map((gear) => (
                              <option
                                key={gear.gear_code}
                                value={gear.gear_code}
                              >
                                {gear.gear_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={resetFilters}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm flex items-center"
                          title="Reset filters"
                        >
                          <Filter className="w-3 h-3 mr-1" />
                          Reset
                        </button>
                      </div>
                    </div>

                    {period.activeDays && period.activeDays.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Port
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gear
                              </th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Active Days
                              </th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {getFilteredActiveDays(period.activeDays).map(
                              (activeDay) => (
                                <tr
                                  key={activeDay.active_id}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    {getPortName(activeDay.port_id)}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    {getGearName(activeDay.gear_code)}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-center">
                                    {editingActiveDays[activeDay.active_id] !==
                                    undefined ? (
                                      <input
                                        type="number"
                                        className="border rounded w-20 px-2 py-1 text-center"
                                        value={
                                          editingActiveDays[activeDay.active_id]
                                        }
                                        onChange={(e) => {
                                          const raw = parseInt(e.target.value);
                                          const max = getDaysInMonthByDate(
                                            period.period.period_date
                                          );
                                          if (!isNaN(raw)) {
                                            updateActiveDayField(
                                              activeDay.active_id,
                                              Math.min(raw, max).toString()
                                            );
                                          } else {
                                            updateActiveDayField(
                                              activeDay.active_id,
                                              ""
                                            );
                                          }
                                        }}
                                        min="0"
                                        max={getDaysInMonthByDate(
                                          period.period.period_date
                                        )}
                                        disabled={isSaving}
                                      />
                                    ) : (
                                      activeDay.active_days
                                    )}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-center">
                                    {editingActiveDays[activeDay.active_id] !==
                                    undefined ? (
                                      <div className="flex justify-center gap-2">
                                        <button
                                          onClick={() =>
                                            saveActiveDayUpdate(
                                              activeDay.active_id
                                            )
                                          }
                                          className="p-1 text-green-600 hover:text-green-800 disabled:text-gray-400"
                                          title="Save"
                                          disabled={isSaving}
                                        >
                                          <Save className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            const updatedEditingActiveDays = {
                                              ...editingActiveDays,
                                            };
                                            delete updatedEditingActiveDays[
                                              activeDay.active_id
                                            ];
                                            setEditingActiveDays(
                                              updatedEditingActiveDays
                                            );
                                          }}
                                          className="p-1 text-red-600 hover:text-red-800 disabled:text-gray-400"
                                          title="Cancel"
                                          disabled={isSaving}
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          updateActiveDayField(
                                            activeDay.active_id,
                                            activeDay.active_days.toString()
                                          )
                                        }
                                        className="p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                                        title="Edit"
                                        disabled={isSaving}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        No active days data for this period.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PeriodManagement;

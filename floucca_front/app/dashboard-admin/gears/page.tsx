"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Search } from "lucide-react";
import { 
  getGears, 
  createGear, 
  updateGear, 
  deleteGear, 
  Gear, 
  CreateGearDto, 
  UpdateGearDto 
} from "@/services/gearService";
import ReusableDataTable from "@/components/admin/table";

interface GearFormData {
  gear_code: number;
  gear_name: string;
  equipment_id: string;
  equipment_name: string;
}

const GearManagement = () => {
  const [gears, setGears] = useState<Gear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editGearCode, setEditGearCode] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<GearFormData>();

  // Define columns for the table
  const columns = [
    { key: "gear_code", header: "Gear Code" },
    { key: "gear_name", header: "Gear Name" },
    { key: "equipment_id", header: "Equipment ID" },
    { key: "equipment_name", header: "Equipment Name" },
  ];

  const fetchGearsData = async () => {
    try {
      setIsLoading(true);
      const data = await getGears();
      setGears(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching gears:", err);
      setError("Failed to load gears. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGearsData();
  }, []);

  useEffect(() => {
    if (isEditMode && editGearCode) {
      const gearToEdit = gears.find((gear) => gear.gear_code === editGearCode);
      if (gearToEdit) {
        setValue("gear_code", gearToEdit.gear_code);
        setValue("gear_name", gearToEdit.gear_name);
        setValue("equipment_id", gearToEdit.equipment_id);
        setValue("equipment_name", gearToEdit.equipment_name);
      }
    }
  }, [isEditMode, editGearCode, gears, setValue]);

  const onSubmit = async (data: GearFormData) => {
    const formattedData = {
      ...data,
      gear_code: Number(data.gear_code),
    };

    try {
      if (isEditMode && editGearCode) {
        await updateGear(editGearCode, formattedData);
        setGears(gears.map((gear) => 
          gear.gear_code === editGearCode ? formattedData : gear
        ));
      } else {
        console.log("Creating new gear:", formattedData);
        await createGear(formattedData);
        await fetchGearsData();
      }
      closeModal();
    } catch (err: any) {
      console.error("Error saving gear:", err);
      setError("Failed to save gear data. Please try again.");
    }
  };

  const handleEdit = (gear: Gear) => {
    setIsEditMode(true);
    setEditGearCode(gear.gear_code);
    setShowAddModal(true);
  };

  const handleDelete = async (gear: Gear) => {
    try {
      await deleteGear(gear.gear_code);
      setGears(gears.filter((g) => g.gear_code !== gear.gear_code));
      setDeleteConfirmId(null);
    } catch (err: any) {
      console.error("Error deleting gear:", err);
      setError("Failed to delete gear. Please try again.");
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditGearCode(null);
    reset({
      gear_code: undefined,
      gear_name: "",
      equipment_id: "",
      equipment_name: "",
    });
  };

  const filteredGears = gears.filter(
    (gear) =>
      gear.gear_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gear.equipment_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gear Management</h1>
        <button
          onClick={() => {
            setIsEditMode(false);
            setEditGearCode(null);
            reset({
              gear_code: undefined,
              gear_name: "",
              equipment_id: "",
              equipment_name: "",
            });
            setShowAddModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Gear
        </button>
      </div>

      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search gears..."
          className="pl-10 pr-4 py-2 border rounded-lg w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <ReusableDataTable
        data={filteredGears}
        columns={columns}
        keyExtractor={(gear: Gear) => gear.gear_code}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteConfirmId={deleteConfirmId}
        setDeleteConfirmId={(id) => setDeleteConfirmId(typeof id === "number" || id === null ? id : null)}
        noDataMessage={searchTerm ? "No gears found matching the search criteria" : "No gears found"}
      />

      {/* Add/Edit Gear Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Gear" : "Add New Gear"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gear Code {isEditMode && "(Cannot be changed)"}
                </label>
                <input
                  type="number"
                  {...register("gear_code", { 
                    required: "Gear code is required",
                    min: { value: 1, message: "Gear code must be positive" }
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isEditMode}
                />
                {errors.gear_code && (
                  <p className="text-red-500 text-xs mt-1">{errors.gear_code.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gear Name</label>
                <input
                  type="text"
                  {...register("gear_name", { required: "Gear name is required" })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.gear_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.gear_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Equipment ID</label>
                <input
                  type="text"
                  {...register("equipment_id", { 
                    required: "Equipment ID is required",
                    minLength: { value: 3, message: "ID must be 3-5 characters" },
                    maxLength: { value: 5, message: "ID must be 3-5 characters" }
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.equipment_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.equipment_id.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Equipment Name</label>
                <input
                  type="text"
                  {...register("equipment_name", { required: "Equipment name is required" })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.equipment_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.equipment_name.message}</p>
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
                >
                  {isEditMode ? "Update Gear" : "Add Gear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GearManagement;
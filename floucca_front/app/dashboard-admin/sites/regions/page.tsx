"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Search } from "lucide-react";
import { 
  getRegions, 
  createRegion, 
  updateRegion, 
  deleteRegion, 
  Region 
} from "@/services/regionService";
import ReusableDataTable from "@/components/admin/table";

interface RegionFormData {
  region_code: number;
  region_name: string;
}

const RegionManagement = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRegionCode, setEditRegionCode] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<RegionFormData>();

  // Define columns for the table
  const columns = [
    { key: "region_code", header: "Region Code" },
    { key: "region_name", header: "Region Name" },
  ];

  const fetchRegionsData = async () => {
    try {
      setIsLoading(true);
      const data = await getRegions();
      setRegions(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching regions:", err);
      setError("Failed to load regions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegionsData();
  }, []);

  useEffect(() => {
    if (isEditMode && editRegionCode) {
      const regionToEdit = regions.find((region) => region.region_code === editRegionCode);
      if (regionToEdit) {
        setValue("region_code", regionToEdit.region_code);
        setValue("region_name", regionToEdit.region_name);
      }
    }
  }, [isEditMode, editRegionCode, regions, setValue]);

  const onSubmit = async (data: RegionFormData) => {
    const formattedData = {
      ...data,
      region_code: Number(data.region_code),
    };
  
    try {
      if (isEditMode && editRegionCode) {
        await updateRegion(editRegionCode, formattedData);
        setRegions(regions.map((region) =>
          region.region_code === editRegionCode ? formattedData : region
        ));
      } else {
        console.log("Creating new region:", formattedData);
        await createRegion(formattedData);
        await fetchRegionsData();
      }
      closeModal();
    } catch (err: any) {
      console.error("Error saving region:", err);
      setError("Failed to save region data. Please try again.");
    }
  };
  

  const handleEdit = (region: Region) => {
    setIsEditMode(true);
    setEditRegionCode(region.region_code);
    setShowAddModal(true);
  };

  const handleDelete = async (region: Region) => {
    try {
      await deleteRegion(region.region_code);
      setRegions(regions.filter((r) => r.region_code !== region.region_code));
      setDeleteConfirmId(null);
    } catch (err: any) {
      console.error("Error deleting region:", err);
      setError("Failed to delete region. Please try again.");
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditRegionCode(null);
    reset({
      region_code: undefined,
      region_name: "",
    });
  };

  const filteredRegions = regions.filter(
    (region) => region.region_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Region Management</h1>
        <button
          onClick={() => {
            setIsEditMode(false);
            setEditRegionCode(null);
            reset({
              region_code: undefined,
              region_name: "",
            });
            setShowAddModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Region
        </button>
      </div>

      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search regions..."
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
        data={filteredRegions}
        columns={columns}
        keyExtractor={(region) => region.region_code}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteConfirmId={deleteConfirmId}
        setDeleteConfirmId={(id) => setDeleteConfirmId(typeof id === "number" ? id : null)}
        noDataMessage={searchTerm ? "No regions found matching the search criteria" : "No regions found"}
      />

      {/* Add/Edit Region Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Region" : "Add New Region"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Region Code {isEditMode && "(Cannot be changed)"}
                </label>
                <input
                  type="number"
                  {...register("region_code", { 
                    required: "Region code is required",
                    min: { value: 1, message: "Region code must be positive" }
                  })}
                  placeholder="Enter region code"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isEditMode}
                />
                {errors.region_code && (
                  <p className="text-red-500 text-xs mt-1">{errors.region_code.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Region Name</label>
                <input
                  type="text"
                  {...register("region_name", { required: "Region name is required" })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter region name"
                />
                {errors.region_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.region_name.message}</p>
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
                  {isEditMode ? "Update Region" : "Add Region"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionManagement;
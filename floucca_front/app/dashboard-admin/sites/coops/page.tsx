"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Search, RefreshCw } from "lucide-react";
import { 
  getCoops, 
  createCoop, 
  updateCoop, 
  deleteCoop, 
  Coop,
  getRegions,
  Region
} from "@/services";
import ReusableDataTable from "@/components/admin/table";
import { 
  getFromCache, 
  saveToCache, 
  removeFromCache 
} from "@/components/utils/cache-utils";

const CACHE_KEYS = {
  COOPS: 'flouca_admin_coops',
  REGIONS: 'flouca_admin_regions'
};

// 30 minutes
const CACHE_DURATION = 30 * 60 * 1000;

interface CoopFormData {
  coop_code: number;
  coop_name: string;
  region_code: number;
}

const CoopManagement = () => {
  const [coops, setCoops] = useState<Coop[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCoopCode, setEditCoopCode] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CoopFormData>();

  const columns = [
    { key: "coop_code", header: "Coop Code" },
    { key: "coop_name", header: "Cooperative Name" },
    { 
      key: "region_code", 
      header: "Region",
      render: (value: number) => {
        const region = regions.find(r => r.region_code === value);
        return region ? region.region_name : value;
      }
    },
  ];

  const fetchData = async (skipCache = false) => {
    try {
      setIsLoading(true);
      
      let coopsData: Coop[] = [];
      let regionsData: Region[] = [];
      
      if (!skipCache) {
        const cachedCoops = getFromCache<Coop[]>(CACHE_KEYS.COOPS, CACHE_DURATION);
        const cachedRegions = getFromCache<Region[]>(CACHE_KEYS.REGIONS, CACHE_DURATION);
        
        if (cachedCoops && cachedRegions) {
          console.log("Using cached cooperatives and regions data");
          coopsData = cachedCoops;
          regionsData = cachedRegions;
          
          setCoops(cachedCoops);
          setRegions(cachedRegions);
          setError(null);
          
          // Set last fetched time from cache timestamp
          const timestamp = localStorage.getItem(`${CACHE_KEYS.COOPS}_timestamp`);
          if (timestamp) {
            setLastFetched(new Date(parseInt(timestamp)));
          }
          
          setIsLoading(false);
          return;
        }
      }
      [coopsData, regionsData] = await Promise.all([
        getCoops(),
        getRegions()
      ]);
      
      saveToCache(CACHE_KEYS.COOPS, coopsData);
      saveToCache(CACHE_KEYS.REGIONS, regionsData);
      
      setCoops(coopsData);
      setRegions(regionsData);
      setLastFetched(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Force refresh data from API
  const refreshData = () => {
    fetchData(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isEditMode && editCoopCode) {
      const coopToEdit = coops.find((coop) => coop.coop_code === editCoopCode);
      if (coopToEdit) {
        setValue("coop_code", coopToEdit.coop_code);
        setValue("coop_name", coopToEdit.coop_name);
        setValue("region_code", coopToEdit.region_code);
      }
    }
  }, [isEditMode, editCoopCode, coops, setValue]);

  const onSubmit = async (data: CoopFormData) => {
    const formattedData = {
      ...data,
      coop_code: Number(data.coop_code),
      region_code: Number(data.region_code),
    };
  
    try {
      if (isEditMode && editCoopCode) {
        await updateCoop(editCoopCode, formattedData);
        
        setCoops(coops.map((coop) =>
          coop.coop_code === editCoopCode ? formattedData : coop
        ));
        
        const cachedCoops = getFromCache<Coop[]>(CACHE_KEYS.COOPS);
        if (cachedCoops) {
          const updatedCache = cachedCoops.map((coop) =>
            coop.coop_code === editCoopCode ? formattedData : coop
          );
          saveToCache(CACHE_KEYS.COOPS, updatedCache);
        }
      } else {
        console.log("Creating new cooperative:", formattedData);
        await createCoop(formattedData);
        
        removeFromCache(CACHE_KEYS.COOPS);
        await fetchData(true);
      }
      closeModal();
    } catch (err: any) {
      console.error("Error saving cooperative:", err);
      setError("Failed to save cooperative data. Please try again.");
    }
  };
  
  const handleEdit = (coop: Coop) => {
    setIsEditMode(true);
    setEditCoopCode(coop.coop_code);
    setShowAddModal(true);
  };

  const handleDelete = async (coop: Coop) => {
    try {
      await deleteCoop(coop.coop_code);
      setCoops(coops.filter((c) => c.coop_code !== coop.coop_code));
      const cachedCoops = getFromCache<Coop[]>(CACHE_KEYS.COOPS);
      if (cachedCoops) {
        const updatedCache = cachedCoops.filter((c) => c.coop_code !== coop.coop_code);
        saveToCache(CACHE_KEYS.COOPS, updatedCache);
      }
      setDeleteConfirmId(null);
    } catch (err: any) {
      console.error("Error deleting cooperative:", err);
      setError("Failed to delete cooperative. Please try again.");
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditCoopCode(null);
    reset({
      coop_code: undefined,
      coop_name: "",
      region_code: undefined,
    });
  };

  const filteredCoops = coops.filter(
    (coop) => coop.coop_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cooperative Management</h1>
          {lastFetched && (
            <p className="mt-2 text-sm text-gray-500">
              Last updated: {lastFetched.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={refreshData}
            className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg flex items-center"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> 
            Refresh
          </button>
          <button
            onClick={() => {
              setIsEditMode(false);
              setEditCoopCode(null);
              reset({
                coop_code: undefined,
                coop_name: "",
                region_code: undefined,
              });
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Cooperative
          </button>
        </div>
      </div>

      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search cooperatives..."
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
        data={filteredCoops}
        columns={columns}
        keyExtractor={(coop) => coop.coop_code}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteConfirmId={deleteConfirmId}
        setDeleteConfirmId={(id) => setDeleteConfirmId(typeof id === "number" ? id : null)}
        noDataMessage={searchTerm ? "No cooperatives found matching the search criteria" : "No cooperatives found"}
      />

      {/* Add/Edit Cooperative Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Cooperative" : "Add New Cooperative"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cooperative Code {isEditMode && "(Cannot be changed)"}
                </label>
                <input
                  type="number"
                  {...register("coop_code", { 
                    required: "Cooperative code is required",
                    min: { value: 1, message: "Cooperative code must be positive" }
                  })}
                  placeholder="Enter cooperative code"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isEditMode}
                />
                {errors.coop_code && (
                  <p className="text-red-500 text-xs mt-1">{errors.coop_code.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cooperative Name</label>
                <input
                  type="text"
                  {...register("coop_name", { required: "Cooperative name is required" })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter cooperative name"
                />
                {errors.coop_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.coop_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Region</label>
                <select
                  {...register("region_code", { 
                    required: "Region is required",
                    validate: value => Number(value) > 0 || "Please select a region"
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select a region</option>
                  {regions.map((region) => (
                    <option key={region.region_code} value={region.region_code}>
                      {region.region_name}
                    </option>
                  ))}
                </select>
                {errors.region_code && (
                  <p className="text-red-500 text-xs mt-1">{errors.region_code.message}</p>
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
                  {isEditMode ? "Update Cooperative" : "Add Cooperative"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoopManagement;
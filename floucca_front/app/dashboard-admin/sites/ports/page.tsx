"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Search, RefreshCw } from "lucide-react";
import { 
  getDetailedPorts, 
  createPort, 
  updatePort, 
  deletePort, 
  PortDetailed,
  getCoops,
  Coop
} from "@/services";
import ReusableDataTable from "@/components/admin/table";
import { 
  getFromCache, 
  saveToCache, 
  removeFromCache 
} from "@/components/utils/cache-utils";

// Cache keys and duration
const CACHE_KEYS = {
  PORTS: 'flouca_admin_ports',
  DETAILED_PORTS: 'flouca_admin_detailed_ports',
  COOPS: 'flouca_admin_coops'
};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface PortFormData {
  port_id?: number;
  port_name: string;
  coop_code: number;
}

const PortManagement = () => {
  const [ports, setPorts] = useState<PortDetailed[]>([]);
  const [coops, setCoops] = useState<Coop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPortId, setEditPortId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<PortFormData>();

  // Define columns for the table with combined information
  const columns = [
    { key: "port_id", header: "Port ID" },
    { key: "port_name", header: "Port Name" },
    { 
      key: "coop", 
      header: "Cooperative",
      render: (value: any) => value?.coop_name || 'N/A'
    },
    { 
      key: "region", 
      header: "Region",
      render: (_: any, item: PortDetailed) => item.coop?.region?.region_name || 'N/A'
    }
  ];

  const fetchData = async (skipCache = false) => {
    try {
      setIsLoading(true);
      
      let portsData: PortDetailed[] = [];
      let coopsData: Coop[] = [];
      
      if (!skipCache) {
        const cachedPorts = getFromCache<PortDetailed[]>(CACHE_KEYS.DETAILED_PORTS, CACHE_DURATION);
        const cachedCoops = getFromCache<Coop[]>(CACHE_KEYS.COOPS, CACHE_DURATION);
        
        if (cachedPorts && cachedCoops) {
          console.log("Using cached ports and coops data");
          portsData = cachedPorts;
          coopsData = cachedCoops;
          
          setPorts(cachedPorts);
          setCoops(cachedCoops);
          setError(null);
          
          const timestamp = localStorage.getItem(`${CACHE_KEYS.DETAILED_PORTS}_timestamp`);
          if (timestamp) {
            setLastFetched(new Date(parseInt(timestamp)));
          }
          
          setIsLoading(false);
          return;
        }
      }
      
      [portsData, coopsData] = await Promise.all([
        getDetailedPorts(),
        getCoops()
      ]);
      
      saveToCache(CACHE_KEYS.DETAILED_PORTS, portsData);
      saveToCache(CACHE_KEYS.COOPS, coopsData);
      
      setPorts(portsData);
      setCoops(coopsData);
      setLastFetched(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshData = () => {
    fetchData(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isEditMode && editPortId) {
      const portToEdit = ports.find((port) => port.port_id === editPortId);
      if (portToEdit) {
        setValue("port_id", portToEdit.port_id);
        setValue("port_name", portToEdit.port_name);
        setValue("coop_code", portToEdit.coop.coop_code);
      }
    }
  }, [isEditMode, editPortId, ports, setValue]);

  const onSubmit = async (data: PortFormData) => {
    try {
      if (isEditMode && editPortId) {
        await updatePort(editPortId, {
          port_name: data.port_name,
          coop_code: Number(data.coop_code)
        });
        
        const selectedCoop = coops.find(c => c.coop_code === Number(data.coop_code));
        
        const updatedPorts = ports.map((port) => {
          if (port.port_id === editPortId) {
            return {
              ...port,
              port_name: data.port_name,
              coop: {
                ...port.coop,
                coop_code: Number(data.coop_code),
                coop_name: selectedCoop?.coop_name || port.coop.coop_name,
                region: selectedCoop?.region_code === port.coop.region.region_code ? 
                  port.coop.region : port.coop.region
              }
            };
          }
          return port;
        });
        
        setPorts(updatedPorts);
        
        // Update cache
        saveToCache(CACHE_KEYS.DETAILED_PORTS, updatedPorts);
      } else {
        await createPort({
          port_name: data.port_name,
          coop_code: Number(data.coop_code)
        });
        
        removeFromCache(CACHE_KEYS.DETAILED_PORTS);
        await fetchData(true);
      }
      closeModal();
    } catch (err: any) {
      console.error("Error saving port:", err);
      setError("Failed to save port data. Please try again.");
    }
  };

  const handleEdit = (port: PortDetailed) => {
    setIsEditMode(true);
    setEditPortId(port.port_id);
    setShowAddModal(true);
  };

  const handleDelete = async (port: PortDetailed) => {
    try {
      await deletePort(port.port_id);
      
      const updatedPorts = ports.filter((p) => p.port_id !== port.port_id);
      setPorts(updatedPorts);
      
      saveToCache(CACHE_KEYS.DETAILED_PORTS, updatedPorts);
      
      setDeleteConfirmId(null);
    } catch (err: any) {
      console.error("Error deleting port:", err);
      setError("Failed to delete port. Please try again.");
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditPortId(null);
    reset({
      port_id: undefined,
      port_name: "",
      coop_code: undefined,
    });
  };

  const filteredPorts = ports.filter(
    (port) => 
      port.port_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      port.coop?.coop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      port.coop?.region?.region_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Port Management</h1>
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
              setEditPortId(null);
              reset({
                port_id: undefined,
                port_name: "",
                coop_code: undefined,
              });
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Port
          </button>
        </div>
      </div>

      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search ports, cooperatives, or regions..."
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
        data={filteredPorts}
        columns={columns}
        keyExtractor={(port) => port.port_id}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteConfirmId={deleteConfirmId}
        setDeleteConfirmId={(id) => setDeleteConfirmId(typeof id === "number" ? id : null)}
        noDataMessage={searchTerm ? "No ports found matching the search criteria" : "No ports found"}
      />

      {/* Add/Edit Port Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Port" : "Add New Port"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Port Name</label>
                <input
                  type="text"
                  {...register("port_name", { required: "Port name is required" })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter port name"
                />
                {errors.port_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.port_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cooperative</label>
                <select
                  {...register("coop_code", { 
                    required: "Cooperative is required",
                    validate: value => Number(value) > 0 || "Please select a cooperative"
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select a cooperative</option>
                  {coops.map((coop) => (
                    <option key={coop.coop_code} value={coop.coop_code}>
                      {coop.coop_name}
                    </option>
                  ))}
                </select>
                {errors.coop_code && (
                  <p className="text-red-500 text-xs mt-1">{errors.coop_code.message}</p>
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
                  {isEditMode ? "Update Port" : "Add Port"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortManagement;
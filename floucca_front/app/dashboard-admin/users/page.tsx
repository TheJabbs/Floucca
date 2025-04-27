"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Search, RefreshCw } from "lucide-react";

import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/userService";
import { getRoles } from "@/services/roleService";
import { getCoops } from "@/services/coopService";
import UserTable from "@/components/user-management/user-table";
import UserFormModal from "@/components/user-management/user-form-modal";
import { 
  getFromCache, 
  saveToCache, 
} from "@/components/utils/cache-utils";

const CACHE_KEYS = {
  USERS: 'flouca_admin_users',
  ROLES: 'flouca_admin_roles',
  COOPS: 'flouca_admin_coops'
};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roles: number[];
  coops: number[];
}

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roles: { id: number; name: string }[];
  coops: { id: number; name: string }[];
  lastLogin: string;
  creationTime: string;
}

interface Role {
  id: number;
  code?: string;
  name: string;
}

interface Coop {
  id: number;
  name: string;
  region_code?: number;
}

interface ErrorState {
  type: "form" | "server" | "fetch";
  message: string;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [coops, setCoops] = useState<Coop[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<UserFormData>();

  const fetchData = async (skipCache = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!skipCache) {
        const cachedUsers = getFromCache<UserData[]>(CACHE_KEYS.USERS, CACHE_DURATION);
        const cachedRoles = getFromCache<Role[]>(CACHE_KEYS.ROLES, CACHE_DURATION);
        const cachedCoops = getFromCache<Coop[]>(CACHE_KEYS.COOPS, CACHE_DURATION);
        
        if (cachedUsers && cachedRoles && cachedCoops) {
          console.log("Using cached user management data");
          setUsers(cachedUsers);
          setRoles(cachedRoles);
          setCoops(cachedCoops);
          
          const timestamp = localStorage.getItem(`${CACHE_KEYS.USERS}_timestamp`);
          if (timestamp) {
            setLastFetched(new Date(parseInt(timestamp)));
          }
          
          setIsLoading(false);
          return;
        }
      }
      
      const [rolesData, coopsData, usersData] = await Promise.all([
        getRoles(),
        getCoops(),
        getAllUsers(),
      ]);

      const transformedRoles = rolesData.map((role) => ({
        id: role.role_id,
        code: role.role_code,
        name: role.role_name,
      }));

      const transformedCoops = coopsData.map((coop) => ({
        id: coop.coop_code,
        name: coop.coop_name,
        region_code: coop.region_code,
      }));

      const transformedUsers = usersData.map((user) => ({
        id: user.user_id,
        firstName: user.user_fname,
        lastName: user.user_lname,
        email: user.user_email || "",
        phone: user.user_phone || "",
        password: user.user_pass,
        roles: user.roles?.map((r) => ({ id: r.role_id, name: r.role_name })) || [],
        coops: user.coops?.map((c) => ({ id: c.coop_code, name: c.coop_name })) || [],
        lastLogin: user.last_login || "",
        creationTime: user.creation_time || "",
      }));

      saveToCache(CACHE_KEYS.ROLES, transformedRoles);
      saveToCache(CACHE_KEYS.COOPS, transformedCoops);
      saveToCache(CACHE_KEYS.USERS, transformedUsers);
      
      setRoles(transformedRoles);
      setCoops(transformedCoops);
      setUsers(transformedUsers);
      setLastFetched(new Date());
    } catch (err: any) {
      setError({
        type: "fetch",
        message: err.message || "Failed to load data. Please try again later.",
      });
      console.error("Error fetching data:", err);
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
    if (isEditMode && editUserId) {
      const userToEdit = users.find((user) => user.id === editUserId);
      if (userToEdit) {
        reset({
          firstName: userToEdit.firstName,
          lastName: userToEdit.lastName,
          email: userToEdit.email,
          phone: userToEdit.phone,
          password: userToEdit.password,
          roles: userToEdit.roles.map((role) => role.id),
          coops: userToEdit.coops.map((coop) => coop.id),
        });
      }
    }
  }, [isEditMode, editUserId, reset, users]);

  const onSubmit = async (data: UserFormData) => {
    try {
      setError(null);
      if (isEditMode && editUserId) {
        await updateUser(editUserId, {
          user_fname: data.firstName,
          user_lname: data.lastName,
          user_email: data.email,
          user_phone: data.phone,
          user_pass: data.password,
          role_ids: data.roles,
          coop_codes: data.coops,
        });
        
        // Update user in local state
        const updatedUser = {
          ...users.find(u => u.id === editUserId)!,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          roles: data.roles.map((id) => ({ id, name: roles.find((r) => r.id === id)?.name || "Unknown" })),
          coops: data.coops.map((id) => ({ id, name: coops.find((c) => c.id === id)?.name || "Unknown" })),
        };
        
        const updatedUsers = users.map((user) =>
          user.id === editUserId ? updatedUser : user
        );
        setUsers(updatedUsers);
        
        // Update cache
        saveToCache(CACHE_KEYS.USERS, updatedUsers);
      } else {
        const res = await createUser({
          user_fname: data.firstName,
          user_lname: data.lastName,
          user_email: data.email,
          user_phone: data.phone,
          user_pass: data.password,
          role_ids: data.roles,
          coop_codes: data.coops,
        });

        const newUserId = res.data?.user_id;
        if (newUserId) {
          const newUser = {
            id: newUserId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            password: data.password,
            roles: data.roles.map((id) => ({ id, name: roles.find((r) => r.id === id)?.name || "Unknown" })),
            coops: data.coops.map((id) => ({ id, name: coops.find((c) => c.id === id)?.name || "Unknown" })),
            lastLogin: "",
            creationTime: new Date().toISOString(),
          };
          
          const updatedUsers = [newUser, ...users];
          setUsers(updatedUsers);
          
          // Update cache
          saveToCache(CACHE_KEYS.USERS, updatedUsers);
        }
      }
      closeModal();
    } catch (err: any) {
      setError({ type: "server", message: err.message || "Failed to save user data." });
    }
  };

  const handleEdit = (id: number) => {
    setIsEditMode(true);
    setEditUserId(id);
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      
      // Update local state
      const updatedUsers = users.filter((u) => u.id !== id);
      setUsers(updatedUsers);
      
      // Update cache
      saveToCache(CACHE_KEYS.USERS, updatedUsers);
      
      setShowConfirmDelete(null);
    } catch (err: any) {
      setError({ type: "server", message: err.message });
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditUserId(null);
    reset();
    setError(null);
  };

  const formatDate = (date: string) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleRole = (id: number) => {
    const current = getValues("roles") || [];
    setValue("roles", current.includes(id) ? current.filter((r) => r !== id) : [...current, id]);
  };

  const toggleCoop = (id: number) => {
    const current = getValues("coops") || [];
    setValue("coops", current.includes(id) ? current.filter((c) => c !== id) : [...current, id]);
  };

  const filteredUsers = users
  .slice()
  .sort((a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime())
  .filter((u) => {
    const search = searchTerm.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(search) ||
      u.lastName.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search)
    );
  });


  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error?.type === "fetch") {
    return (
      <div className="p-6 text-center text-red-600">
        {error.message}
        <button onClick={refreshData} className="ml-4 text-blue-600 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
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
              setEditUserId(null);
              reset({ firstName: "", lastName: "", email: "", phone: "", password: "", roles: [], coops: [] });
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Add User
          </button>
        </div>
      </div>

      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          className="pl-10 pr-4 py-2 border rounded-lg w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <UserTable
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showConfirmDelete={showConfirmDelete}
        setShowConfirmDelete={setShowConfirmDelete}
        formatDate={formatDate}
      />

      <UserFormModal
        isOpen={showAddModal}
        isEditMode={isEditMode}
        roles={roles}
        coops={coops}
        showPassword={showPassword}
        togglePassword={() => setShowPassword((prev) => !prev)}
        onClose={closeModal}
        onSubmit={onSubmit}
        control={control}
        register={register}
        errors={errors}
        error={error}
        handleSubmit={handleSubmit}
        toggleRole={toggleRole}
        toggleCoop={toggleCoop}
      />
    </div>
  );
};

export default UsersManagement;
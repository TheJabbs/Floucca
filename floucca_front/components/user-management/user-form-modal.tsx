import React from "react";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface Role {
  id: number;
  name: string;
}

interface Coop {
  id: number;
  name: string;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roles: number[];
  coops: number[];
}

interface ErrorState {
  type: "form" | "server" | "fetch";
  message: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  roles: Role[];
  coops: Coop[];
  showPassword: boolean;
  togglePassword: () => void;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  control: any;
  register: any;
  errors: FieldErrors<UserFormData>;
  error: ErrorState | null;
  handleSubmit: any;
  toggleRole: (roleId: number) => void;
  toggleCoop: (coopId: number) => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  isEditMode,
  roles,
  coops,
  showPassword,
  togglePassword,
  onClose,
  onSubmit,
  control,
  register,
  errors,
  error,
  handleSubmit,
  toggleRole,
  toggleCoop,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? "Edit User" : "Add New User"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                {...register("firstName", { required: "First name is required" })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                    message: "Invalid phone number",
                  },
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  maxLength: {
                    value: 15,
                    message: "Password cannot exceed 15 characters",
                  },
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 mt-1"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
            <Controller
              name="roles"
              control={control}
              rules={{ required: "At least one role is required" }}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      className={`px-3 py-1.5 text-sm rounded-full ${field.value?.includes(role.id)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      onClick={() => toggleRole(role.id)}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.roles && <p className="text-red-500 text-xs mt-1">Please select at least one role</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cooperatives</label>
            <Controller
              name="coops"
              control={control}
              rules={{ required: "At least one cooperative is required" }}
              render={({ field }) => (
                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {coops.map((coop) => (
                      <div
                        key={coop.id}
                        className={`px-3 py-2 border rounded-lg cursor-pointer ${field.value?.includes(coop.id)
                            ? "bg-green-50 border-green-300 text-green-800"
                            : "bg-white hover:bg-gray-50"
                          }`}
                        onClick={() => toggleCoop(coop.id)}
                      >
                        {coop.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            />
            {errors.coops && <p className="text-red-500 text-xs mt-1">Please select at least one cooperative</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            {error?.type === "server" && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error.message}</span>
              </div>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              {isEditMode ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;

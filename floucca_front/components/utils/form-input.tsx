import React from "react";
import { UseFormRegister } from "react-hook-form";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  required = false,
  placeholder = "",
  register,
  error,
}) => {
  return (
    <div className="form-group mb-2">
      <label
        htmlFor={name}
        className="block text-gray-700 text-sm font-semibold mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        {...register(name, { required })}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
        min={type === "number" ? 0 : undefined}
        required={required}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;

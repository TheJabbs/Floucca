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
  min?: number;
  max?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  required = false,
  placeholder = "",
  min=0,
  max,
  register,
  error,
}) => {
  // Prevent invalid characters in number inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number" && (e.key === "-" || e.key === "e")) {
      e.preventDefault();
    }
  };

  return (
    <div className="form-group mb-2">
      <label htmlFor={name} className="block text-gray-700 text-sm font-semibold mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        {...register(name, { 
          required,
          valueAsNumber: type === "number",
          validate: type === "number" ? (value) => 
            (!isNaN(value) && (min === undefined || value >= min) && (max === undefined || value <= max)) || 
            `Value must be between ${min} and ${max}` 
            : undefined,
        })}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
        onKeyDown={handleKeyDown}
        required={required}
        min={type === "number" ? min : undefined}
        max={type === "number" ? max : undefined}
        step={type === "number" ? "any" : undefined} 
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;

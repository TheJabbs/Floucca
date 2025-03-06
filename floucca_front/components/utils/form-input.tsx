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
  min,
  max,
  register,
  error,
}) => {
  // Handle keydown to prevent typing negative sign for number inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number" && e.key === "-") {
      e.preventDefault();
    }
  };

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
        {...register(name, { 
          required,
          validate: type === "number" ? value => 
            value >= 0 || "Value must be a positive number" : undefined,
          valueAsNumber: type === "number"
        })}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
        min={type === "number" ? min : undefined}
        max={type === "number" ? max : undefined}
        onKeyDown={handleKeyDown}
        required={required}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
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
  min = 0,
  max,
  register,
  error,
}) => {
  // Handle keydown to prevent typing "-" or "e" for number inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number" && (e.key === "-" || e.key === "e")) {
      e.preventDefault();
    }
  };

  // Handle onChange to restrict input value dynamically
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    if (type === "number") {
      let numericValue = Number(value);
      
      // Ensure value stays within min and max limits
      if (numericValue < (min ?? 0)) {
        e.target.value = String(min ?? 0);
      } else if (max !== undefined && numericValue > max) {
        e.target.value = String(max);
      }
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
          validate: type === "number" ? (value) => 
            (value >= (min ?? 0) && value <= (max ?? Infinity)) || `Value must be between ${min} and ${max}` : undefined,
          valueAsNumber: type === "number"
        })}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
        min={type === "number" ? min : 0}
        max={type === "number" ? max : undefined}
        onKeyDown={handleKeyDown}
        onChange={handleChange} // Prevents values exceeding max
        required={required}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;

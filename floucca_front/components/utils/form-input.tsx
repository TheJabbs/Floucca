import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; 
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  required = false,
  placeholder = "",
  value,
  onChange,
  error,
}) => {
  return (
    <div className="form-group mb-4">
      <label
        htmlFor={name}
        className="block text-gray-700 text-sm font-semibold mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
        min={type === "number" ? 0 : undefined}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>} 
    </div>
  );
};

export default FormInput;

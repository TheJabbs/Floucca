// components/utils/form-field.tsx
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  required?: boolean;
  type?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}

const FormField = <T extends FieldValues>({
  name,
  label,
  control,
  required = false,
  type = "text",
  placeholder = "",
  min,
  max,
}: FormFieldProps<T>) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number" && (e.key === "-" || e.key === "e")) {
      e.preventDefault();
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? `${label} is required` : false,
        min:
          required && min !== undefined
            ? { value: min, message: `Minimum value is ${min}` }
            : undefined,
        max:
          required && max !== undefined
            ? { value: max, message: `Maximum value is ${max}` }
            : undefined,
      }}
      
      render={({ field, fieldState: { error } }) => (
        <div className="form-group mb-2 w-full">
          <label
            htmlFor={name}
            className="block text-gray-700 text-sm font-semibold mb-1"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <input
            id={name}
            type={type}
            {...field}
            value={field.value || (type === "number" ? "" : field.value)}
            onChange={(e) => {
              const value =
                type === "number"
                  ? e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                  : e.target.value;
              field.onChange(value);
            }}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            onKeyDown={handleKeyDown}
            min={type === "number" ? min : undefined}
            max={type === "number" ? max : undefined}
            required={required}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default FormField;

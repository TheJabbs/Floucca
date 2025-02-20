import React from "react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  disabled?: boolean;
  label?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, disabled = false, label = "Submit" }) => {
  return (
    <div className="relative group">
      <button
        type="submit"
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isSubmitting || disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmitting || disabled}
      >
        {isSubmitting ? "Submitting..." : label}
      </button>

      {/* Tooltip: Visible only when the button is disabled */}
      {disabled && (
        <div className="absolute transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Please fill all required fields.
        </div>
      )}
    </div>
  );
};

export default SubmitButton;

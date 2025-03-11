import React from "react";

interface DashboardButtonProps {
  label: string;
  onClick?: () => void; 
}

const DashboardButton: React.FC<DashboardButtonProps> = ({ label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full px-4 py-2 text-left rounded-md bg-gray-200 
        hover:bg-gray-300 transition-colors
      "
    >
      {label}
    </button>
  );
};

export default DashboardButton;

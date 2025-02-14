// components/utils/add-button.tsx
import React from 'react';

interface AddButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  children = '+'
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
        ${disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default AddButton;
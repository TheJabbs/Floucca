import React from 'react';
import styles from '../dropdown/dropdown.module.css';

interface DropdownProps<T> {
  options: { value: T; label: string }[];
  selectedValue: T;
  onChange: (value: T) => void;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

const Dropdown = <T extends string | number>({
  options,
  selectedValue,
  onChange,
  label,
  required = false,
  disabled = false,
}: DropdownProps<T>) => (
  <div className={styles.dropdownContainer}> 
    <label className={styles.dropdownLabel}> 
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={selectedValue}
      onChange={(e) => onChange(e.target.value as T)}
      className={styles.dropdownSelect} 
      disabled={disabled}
    >
      <option value={''} disabled>
        {label}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default Dropdown;

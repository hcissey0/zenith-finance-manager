
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

const Select: React.FC<SelectProps> = ({ label, id, options, ...props }) => {
  const selectId = id || label.toLowerCase().replace(' ', '-');
  return (
    <div>
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={selectId}
        className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 pl-3 pr-10 text-white focus:ring-primary focus:border-primary sm:text-sm"
        {...props}
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;

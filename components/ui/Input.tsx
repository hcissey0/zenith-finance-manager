import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  leadingSymbol?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  leadingSymbol,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(" ", "-");

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {leadingSymbol && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-400 sm:text-sm">{leadingSymbol}</span>
          </div>
        )}
        <input
          id={inputId}
          autoComplete="off"
          className={`block w-full bg-gray-700 border-gray-600 rounded-md py-2 pr-3 text-white placeholder-gray-400 focus:ring-primary focus:border-primary sm:text-sm ${
            leadingSymbol ? "pl-12" : "pl-3"
          }`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;

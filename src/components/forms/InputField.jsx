import React from "react";

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  options = [],
  icon: Icon,
  className = "",
  rows = 3,
  ...rest
}) => {
  const hasError = !!error;

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="mb-1 text-[11px] font-semibold text-[#1e293b]">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`bg-[#f4f5f7] border border-[#e2e8f0] text-[11px] text-[#1e293b] rounded-md px-3 py-2 w-full focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] appearance-none ${
              hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.2em 1.2em",
              paddingRight: "1.5rem",
            }}
            {...rest}
          >
            <option value="" disabled className="text-gray-400">
              {placeholder || `Select ${label}`}
            </option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className={`bg-[#f4f5f7] border border-[#e2e8f0] text-[11px] text-[#1e293b] rounded-md px-3 py-2 w-full focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] placeholder-gray-400 resize-none ${
              hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            {...rest}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`bg-[#f4f5f7] border border-[#e2e8f0] text-[11px] text-[#1e293b] rounded-md px-3 py-2 w-full focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] placeholder-gray-400 ${
              hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            } ${Icon ? "pr-8" : ""}`}
            {...rest}
          />
        )}

        {type !== "textarea" && type !== "select" && Icon && (
          <Icon className="absolute right-2.5 text-gray-400" size={14} />
        )}
      </div>

      {hasError && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
    </div>
  );
};

export default InputField;

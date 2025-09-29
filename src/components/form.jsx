export function LabeledInput({ label, className = "", ...props }) {
    return (
      <div>
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
        )}
        <input
          {...props}
          className={
            "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm " +
            "focus:border-blue-500 focus:outline-none " +
            "text-gray-900 placeholder-gray-500 " +  
            className
          }
        />
      </div>
    );
  }
  
  export function LabeledSelect({
    label,
    options = [],
    value,
    onChange,
    placeholder,
    className = "",
  }) {
    return (
      <div>
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
        )}
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={
            "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm " +
            "focus:border-blue-500 focus:outline-none " +
            className
          }
        >
          <option value="">{placeholder ?? "Select an option"}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
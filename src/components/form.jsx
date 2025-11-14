export function LabeledInput({ label, className = "", ...props }) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium text-[#111827]">
          {label}
        </label>
      )}
      <input
        {...props}
        className={[
          "mt-1 w-full rounded-md border border-[#d1d5db] bg-[#ffffff] px-3 py-2 text-sm",
          "text-[#111827] placeholder-[#9ca3af] focus:border-[#ef4444] focus:outline-none focus:ring-1 focus:ring-[#ef4444]",
          className,
        ].join(" ")}
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
        <label className="mb-1 block text-sm font-medium text-[#111827]">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={
          "mt-1 w-full rounded-md border border-[#d1d5db] bg-[#ffffff] px-3 py-2 text-sm " +
          "focus:border-[#ef4444] focus:outline-none text-[#111827] " +
          "placeholder-[#9ca3af] " +
          className
        }
      >
        <option value="">{placeholder ?? "Select an option"}</option>
        {options.map((opt) => (
          <option
            key={opt}
            value={opt}
            className="bg-[#ffffff] text-[#111827]"
          >
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

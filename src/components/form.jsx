export function LabeledInput({ label, className = "", ...props }) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium text-[#EEEef0]">
          {label}
        </label>
      )}
      <input
        {...props}
        className={[
          "mt-1 w-full rounded-md border border-[#5A2B29] bg-[#201311] px-3 py-2 text-sm",
          "text-[#EEEef0] placeholder-[#EEEef0]/50 focus:border-[#BA3F3D] focus:outline-none focus:ring-1 focus:ring-[#BA3F3D]",
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
        <label className="mb-1 block text-sm font-medium text-[#EEEef0]">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={
          "mt-1 w-full rounded-md border border-[#5A2B29] bg-[#201311] px-3 py-2 text-sm " +
          "focus:border-[#BA3F3D] focus:outline-none text-[#EEEef0] " +
          "placeholder-[#EEEef0]/60 " +
          className
        }
      >
        <option value="">{placeholder ?? "Select an option"}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#201311] text-[#EEEef0]">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

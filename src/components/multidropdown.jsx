"use client";

import { Fragment, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function MultiSelectDropdown({
  label,
  name,
  options = [],
  values = [],
  onChange,
  placeholder = "Select…",
  containerClass = "",
  buttonClass = "",
  searchable = true,
  searchPlaceholder = "Search…",
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((opt) => String(opt).toLowerCase().includes(q));
  }, [options, query, searchable]);

  const clearAll = (e) => {
    e.stopPropagation();
    onChange?.([]);
  };

  return (
    <div className={containerClass}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-[#111827]">
          {label}
        </label>
      )}

      <Listbox
        multiple
        value={values}
        onChange={(v) => {
          onChange?.(v);
        }}
      >
        <div className="relative">
          <Listbox.Button
            className={[
              "w-full rounded-md border border-[#d1d5db] bg-[#ffffff] px-3 py-2 text-left text-sm",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444]",
              "flex items-center justify-between",
              values.length ? "text-[#111827]" : "text-[#9ca3af]",
              buttonClass,
            ].join(" ")}
          >
            <span className="flex flex-wrap gap-1 truncate">
              {values.length === 0 && <span className="truncate">{placeholder}</span>}
              {values.length > 0 &&
                (values.length <= 3
                  ? values.map((v) => (
                      <span
                        key={v}
                        className="inline-flex items-center gap-1 rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-2 py-0.5 text-xs text-[#374151]"
                      >
                        {v}
                      </span>
                    ))
                  : <span className="text-[#374151]">{values.length} selected</span>
                )}
            </span>

            <div className="ml-2 flex items-center gap-2">
              {values.length > 0 && (
                <span
                  role="button"
                  aria-label="Clear"
                  tabIndex={0}
                  className="rounded p-1 hover:bg-[#f3f4f6]"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={clearAll}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") clearAll(e);
                  }}
                >
                  <XMarkIcon className="h-4 w-4 text-[#9ca3af]" />
                </span>
              )}
              <ChevronUpDownIcon className="h-5 w-5 text-[#9ca3af]" />
            </div>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-[#e5e7eb] bg-[#ffffff] text-sm text-[#111827] shadow-lg focus:outline-none">
              {searchable && (
                <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[#e5e7eb] bg-[#f9fafb] px-3 py-2">
                  <MagnifyingGlassIcon className="h-4 w-4 text-[#9ca3af]" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-md border border-[#e5e7eb] bg-[#ffffff] px-2 py-1 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#ef4444] focus:outline-none"
                  />
                  {query && (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Clear search"
                      className="rounded p-1 hover:bg-[#e5e7eb]"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setQuery("")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setQuery("");
                      }}
                    >
                      <XMarkIcon className="h-4 w-4 text-[#9ca3af]" />
                    </span>
                  )}
                </div>
              )}

              <div className="max-h-64 overflow-auto py-1">
                {filtered.length === 0 && (
                  <div className="px-3 py-2 text-[#9ca3af]">No matches</div>
                )}

                {filtered.map((opt) => (
                  <Listbox.Option
                    key={opt}
                    value={opt}
                    className={({ active, selected }) =>
                      [
                        "flex cursor-pointer select-none items-center justify-between px-3 py-2",
                        active ? "bg-[#fee2e2] text-[#111827]" : "text-[#111827]",
                        selected ? "font-medium" : "",
                      ].join(" ")
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className="truncate">{opt}</span>
                        {selected && <CheckIcon className="h-4 w-4 text-[#ef4444]" />}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </div>
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {name && <input type="hidden" name={name} value={values.join(",")} />}
    </div>
  );
}

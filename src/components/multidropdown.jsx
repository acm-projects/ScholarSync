"use client";

import { Fragment, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon, } from "@heroicons/react/24/solid";

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
        <label className="mb-1 block text-sm font-medium text-[#EEEef0]">
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
              "w-full rounded-md border border-[#5A2B29] bg-[#201311] px-3 py-2 text-left text-sm",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BA3F3D]",
              "flex items-center justify-between",
              values.length ? "text-[#EEEef0]" : "text-[#EEEef0]/60",
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
                        className="inline-flex items-center gap-1 rounded-full border border-[#5A2B29] bg-[#170F0E] px-2 py-0.5 text-xs text-[#EEEef0]"
                      >
                        {v}
                      </span>
                    ))
                  : <span className="text-[#EEEef0]">{values.length} selected</span>
                )}
            </span>

            <div className="ml-2 flex items-center gap-2">
              {values.length > 0 && (
                <span
                  role="button"
                  aria-label="Clear"
                  tabIndex={0}
                  className="rounded p-1 hover:bg-[#3C1A19]"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={clearAll}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") clearAll(e);
                  }}
                >
                  <XMarkIcon className="h-4 w-4 text-[#EEEef0]/70" />
                </span>
              )}
              <ChevronUpDownIcon className="h-5 w-5 text-[#EEEef0]/70" />
            </div>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-[#5A2B29] bg-[#170F0E] text-sm text-[#EEEef0] shadow-lg focus:outline-none">
              {searchable && (
                <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[#5A2B29] bg-[#201311] px-3 py-2">
                  <MagnifyingGlassIcon className="h-4 w-4 text-[#EEEef0]/60" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-md border border-[#5A2B29] bg-[#170F0E] px-2 py-1 text-sm text-[#EEEef0] placeholder-[#EEEef0]/50 focus:border-[#BA3F3D] focus:outline-none"
                  />
                  {query && (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Clear search"
                      className="rounded p-1 hover:bg-[#3C1A19]"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setQuery("")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setQuery("");
                      }}
                    >
                      <XMarkIcon className="h-4 w-4 text-[#EEEef0]/60" />
                    </span>
                  )}
                </div>
              )}

              <div className="max-h-64 overflow-auto py-1">
                {filtered.length === 0 && (
                  <div className="px-3 py-2 text-[#EEEef0]/60">No matches</div>
                )}

                {filtered.map((opt) => (
                  <Listbox.Option
                    key={opt}
                    value={opt}
                    className={({ active, selected }) =>
                      [
                        "flex cursor-pointer select-none items-center justify-between px-3 py-2",
                        active ? "bg-[#983734] text-[#EEEef0]" : "text-[#EEEef0]",
                        selected ? "font-medium" : "",
                      ].join(" ")
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className="truncate">{opt}</span>
                        {selected && <CheckIcon className="h-4 w-4" />}
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

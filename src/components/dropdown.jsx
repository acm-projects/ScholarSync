"use client";

import { Fragment, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

export default function Dropdown({
  label,
  name,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
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

  const emitChange = (val) => {
    const fakeEvent = { target: { name, value: val } };
    onChange?.(fakeEvent);
  };

  return (
    <div className={containerClass}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Listbox
        value={value}
        onChange={(v) => {
          emitChange(v);
          setQuery("");
        }}
      >
        <div className="relative">
          <Listbox.Button
            className={[
              "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              "flex items-center justify-between",
              value ? "text-gray-900" : "text-gray-400",
              buttonClass,
            ].join(" ")}
          >
            <span className="truncate">{value || placeholder}</span>
            <div className="ml-2 flex items-center gap-2">
              {value && (
                <span
                  role="button"
                  aria-label="Clear selection"
                  tabIndex={0}
                  className="rounded p-1 hover:bg-gray-100"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    emitChange("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      emitChange("");
                    }
                  }}
                >
                  <XMarkIcon className="h-4 w-4 opacity-60" />
                </span>
              )}
              <ChevronUpDownIcon className="h-5 w-5 opacity-60" />
            </div>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white text-sm shadow-lg focus:outline-none">
              {searchable && (
                <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-gray-200 bg-white px-3 py-2">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                  {query && (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Clear search"
                      className="rounded p-1 hover:bg-gray-100"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setQuery("")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setQuery("");
                      }}
                    >
                      <XMarkIcon className="h-4 w-4 text-gray-400" />
                    </span>
                  )}
                </div>
              )}

              <div className="max-h-60 overflow-auto py-1">
                {filtered.length === 0 && (
                  <div className="px-3 py-2 text-gray-400">No matches</div>
                )}

                {filtered.map((opt) => (
                  <Listbox.Option
                    key={opt}
                    value={opt}
                    className={({ active }) =>
                      [
                        "flex cursor-pointer select-none items-center justify-between px-3 py-2",
                        active ? "bg-blue-50 text-blue-700" : "text-gray-800",
                      ].join(" ")
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`truncate ${selected ? "font-medium" : ""}`}
                        >
                          {opt}
                        </span>
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

      {name && <input type="hidden" name={name} value={value || ""} />}
    </div>
  );
}

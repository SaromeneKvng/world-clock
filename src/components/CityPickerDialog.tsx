import { useEffect, useMemo, useRef, useState } from "react";
import { CITIES, type City } from "../lib/cities";
import { SearchIcon, XIcon } from "./icons";

interface CityPickerDialogProps {
  title?: string;
  excludeIds?: string[];
  onSelect: (city: City) => void;
  onClose: () => void;
}

export function CityPickerDialog({ title = "Add a city", excludeIds = [], onSelect, onClose }: CityPickerDialogProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CITIES.filter((c) => !excludeIds.includes(c.id))
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
      .slice(0, 40);
  }, [query, excludeIds]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[12vh]" onClick={onClose}>
      <div
        className="flex max-h-[70vh] w-full max-w-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-[#18181b]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/10">
          <p className="text-sm font-medium text-black dark:text-white">{title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-6 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10"
          >
            <XIcon className="size-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-white/10">
          <SearchIcon className="size-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cities or countries…"
            className="w-full bg-transparent text-sm text-black outline-none placeholder:text-zinc-400 dark:text-white"
          />
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {results.length === 0 && <p className="px-4 py-6 text-center text-sm text-zinc-400">No cities found.</p>}
          {results.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => {
                onSelect(city);
                onClose();
              }}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <span className="text-sm font-medium text-black dark:text-white">{city.name}</span>
              <span className="text-xs text-zinc-400">{city.country}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

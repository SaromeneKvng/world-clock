import { useEffect, useMemo, useRef, useState } from "react";
import { normalizeSearchText, searchLocalCities, type City } from "../lib/cities";
import { searchWorldCities } from "../lib/geocoding";
import { SearchIcon, XIcon } from "./icons";

interface CityPickerDialogProps {
  title?: string;
  excludeIds?: string[];
  onSelect: (city: City) => void;
  onClose: () => void;
}

function dedupeKey(city: City): string {
  return `${normalizeSearchText(city.name)}|${normalizeSearchText(city.country)}|${city.timeZone}`;
}

export function CityPickerDialog({ title = "Add a city", excludeIds = [], onSelect, onClose }: CityPickerDialogProps) {
  const [query, setQuery] = useState("");
  const [remote, setRemote] = useState<City[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
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

  const localResults = useMemo(
    () => searchLocalCities(query, excludeIds, 20),
    [query, excludeIds],
  );

  const excluded = useMemo(() => new Set(excludeIds), [excludeIds]);
  const localKeys = useMemo(() => new Set(localResults.map(dedupeKey)), [localResults]);

  const queryActive = query.trim().length >= 2;
  const visibleRemote = queryActive ? remote : [];

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const controller = new AbortController();
    setSearching(true);
    setSearchError(false);
    const timer = setTimeout(() => {
      searchWorldCities(q, 10, controller.signal)
        .then((cities) => {
          if (controller.signal.aborted) return;
          const fresh = cities.filter((c) => !excluded.has(c.id) && !localKeys.has(dedupeKey(c)));
          setRemote(fresh);
          setSearching(false);
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          if (err instanceof DOMException && err.name === "AbortError") return;
          setSearching(false);
          setSearchError(true);
        });
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, excluded, localKeys]);

  const hasQuery = query.trim().length > 0;
  const showSearching = searching && queryActive;
  const empty = localResults.length === 0 && visibleRemote.length === 0 && !showSearching;

  function renderCityButton(city: City) {
    return (
      <button
        key={city.id}
        type="button"
        onClick={() => {
          onSelect(city);
          onClose();
        }}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50 sm:py-2.5 dark:hover:bg-white/5"
      >
        <span className="text-sm font-medium text-black dark:text-white">{city.name}</span>
        <span className="text-xs text-zinc-400">{city.country || city.timeZone}</span>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-[6vh] sm:pt-[12vh]"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[70vh] dark:bg-[#18181b]"
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
            placeholder="Search any city in the world…"
            className="w-full bg-transparent text-base text-black outline-none placeholder:text-zinc-400 sm:text-sm dark:text-white"
          />
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {localResults.map(renderCityButton)}
          {visibleRemote.length > 0 && (
            <>
              <p className="px-4 pt-3 pb-1 text-xs font-medium tracking-wide text-zinc-400 uppercase">
                Worldwide results
              </p>
              {visibleRemote.map(renderCityButton)}
            </>
          )}
          {showSearching && (
            <p className="px-4 py-4 text-center text-sm text-zinc-400">Searching worldwide…</p>
          )}
          {empty && (
            <p className="px-4 py-6 text-center text-sm text-zinc-400">
              {hasQuery ? "No cities found. Try another spelling." : "No cities found."}
            </p>
          )}
          {searchError && queryActive && visibleRemote.length === 0 && !showSearching && (
            <p className="px-4 pb-3 text-center text-xs text-zinc-400">
              Worldwide search is unavailable offline — showing saved cities.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

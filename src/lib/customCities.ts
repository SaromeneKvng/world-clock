import { CITIES, isValidTimeZone, type City } from "./cities";

const STORAGE_KEY = "elsewhere:custom-cities";
const MAX_CUSTOM = 300;

function isCity(value: unknown): value is City {
  if (typeof value !== "object" || value === null) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    typeof c.name === "string" &&
    typeof c.country === "string" &&
    typeof c.timeZone === "string" &&
    typeof c.lat === "number" &&
    typeof c.lon === "number" &&
    Number.isFinite(c.lat) &&
    Number.isFinite(c.lon) &&
    isValidTimeZone(c.timeZone)
  );
}

export function getCustomCities(): City[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCity);
  } catch {
    return [];
  }
}

/** Persist a search-selected city so saved ids resolve after reload. */
export function saveCustomCity(city: City): void {
  if (CITIES.some((c) => c.id === city.id)) return;
  try {
    const existing = getCustomCities();
    if (existing.some((c) => c.id === city.id)) return;
    const next = [...existing, city].slice(-MAX_CUSTOM);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — the city still works for this session
  }
}

/** Resolve a built-in or previously saved worldwide city by id. */
export function findCityAny(id: string): City | undefined {
  const builtin = CITIES.find((c) => c.id === id);
  if (builtin) return builtin;
  return getCustomCities().find((c) => c.id === id);
}

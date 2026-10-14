import type { City } from "./cities";
import { isValidTimeZone } from "./cities";

interface OpenMeteoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  country_code?: string;
  timezone?: string;
}

interface OpenMeteoResponse {
  results?: OpenMeteoResult[];
}

const cache = new Map<string, City[]>();

function mapResult(r: OpenMeteoResult): City | null {
  if (!r.timezone || !isValidTimeZone(r.timezone)) return null;
  if (!Number.isFinite(r.latitude) || !Number.isFinite(r.longitude)) return null;
  return {
    id: `geoname-${r.id}`,
    name: r.name,
    country: r.country ?? r.admin1 ?? "",
    timeZone: r.timezone,
    lat: r.latitude,
    lon: r.longitude,
  };
}

/**
 * Worldwide city search via the Open-Meteo geocoding API.
 * Free, no API key, CORS-enabled — fits the app's client-only model.
 */
export async function searchWorldCities(query: string, count = 10, signal?: AbortSignal): Promise<City[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const key = `${q.toLowerCase()}|${count}`;
  const cached = cache.get(key);
  if (cached) return cached;

  async function fetchNames(name: string): Promise<City[]> {
    const url =
      `https://geocoding-api.open-meteo.com/v1/search` +
      `?name=${encodeURIComponent(name)}&count=${count}&language=en&format=json`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`Geocoding request failed (${res.status})`);
    const data = (await res.json()) as OpenMeteoResponse;
    return (data.results ?? []).map(mapResult).filter((c): c is City => c !== null);
  }

  let cities = await fetchNames(q);
  // The API matches prefixes, not fuzzy spellings ("marrakech" finds
  // nothing, but "marrake" finds Marrakesh). Retry with progressively
  // shorter prefixes so variant spellings and trailing typos still hit.
  let prefix = q;
  while (cities.length === 0 && prefix.length > 3 && !signal?.aborted) {
    prefix = prefix.slice(0, -1);
    cities = await fetchNames(prefix);
  }
  cache.set(key, cities);
  return cities;
}

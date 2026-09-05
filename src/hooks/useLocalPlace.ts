import { useEffect, useState } from "react";
import { findCityByTimeZone } from "../lib/cities";

export interface LocalPlace {
  id?: string;
  name: string;
  country?: string;
  timeZone: string;
  lat?: number;
  lon?: number;
}

function humanizeTimeZone(tz: string): string {
  const last = tz.split("/").pop() ?? tz;
  return last.replace(/_/g, " ");
}

/** The device's own location: matched to a known city when possible, with an
 * opt-in geolocation fallback so sunrise/sunset can still be computed. */
export function useLocalPlace(): LocalPlace {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const known = findCityByTimeZone(timeZone);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    known ? { lat: known.lat, lon: known.lon } : null,
  );

  useEffect(() => {
    if (known || !("geolocation" in navigator)) return;
    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!cancelled) setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {
        /* denied or unavailable — sunrise/sunset row is simply omitted */
      },
      { maximumAge: 60 * 60 * 1000, timeout: 5000 },
    );
    return () => {
      cancelled = true;
    };
  }, [known, timeZone]);

  if (known) {
    return { id: known.id, name: known.name, country: known.country, timeZone, lat: known.lat, lon: known.lon };
  }
  return { name: humanizeTimeZone(timeZone), timeZone, lat: coords?.lat, lon: coords?.lon };
}

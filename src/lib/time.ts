export type TimeParts = {
  hour: string;
  minute: string;
  dayPeriod: string;
};

function partsToMap(parts: Intl.DateTimeFormatPart[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const part of parts) map[part.type] = part.value;
  return map;
}

export function getTimeParts(date: Date, timeZone: string, hour12: boolean): TimeParts {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: hour12 ? "h12" : "h23",
    hour: "numeric",
    minute: "2-digit",
  });
  const map = partsToMap(dtf.formatToParts(date));
  return {
    hour: map.hour ?? "00",
    minute: map.minute ?? "00",
    dayPeriod: map.dayPeriod ?? "",
  };
}

export function formatTimeShort(date: Date, timeZone: string, hour12: boolean): string {
  const p = getTimeParts(date, timeZone, hour12);
  return hour12 ? `${p.hour}:${p.minute} ${p.dayPeriod}` : `${p.hour}:${p.minute}`;
}

export function formatFullDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getLocalYMD(date: Date, timeZone: string): { y: number; m: number; d: number } {
  const map = partsToMap(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date),
  );
  return { y: Number(map.year), m: Number(map.month), d: Number(map.day) };
}

/** Offset from UTC, in minutes, for the given time zone at the given instant. */
export function getOffsetMinutes(timeZone: string, date: Date = new Date()): number {
  const map = partsToMap(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(date),
  );
  const asUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour) % 24,
    Number(map.minute),
    Number(map.second),
  );
  return Math.round((asUTC - date.getTime()) / 60000);
}

export function formatUtcOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? ":" + String(m).padStart(2, "0") : ""}`;
}

export function getTimeZoneAbbreviation(timeZone: string, date: Date = new Date()): string {
  const map = partsToMap(
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short", hour: "numeric" }).formatToParts(date),
  );
  return map.timeZoneName ?? "";
}

/** Difference between a city's offset and the reference (local) offset, in minutes. */
export function getRelativeOffsetLabel(cityMinutes: number, referenceMinutes: number): string {
  const diff = cityMinutes - referenceMinutes;
  if (diff === 0) return "Same time as you";
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const parts = [h ? `${h}h` : "", m ? `${m}m` : ""].filter(Boolean).join(" ");
  return `${parts} ${diff > 0 ? "ahead" : "behind"}`;
}

export function formatSignedOffset(diffMinutes: number): string {
  if (diffMinutes === 0) return "Same time";
  const sign = diffMinutes > 0 ? "+" : "-";
  const abs = Math.abs(diffMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h ? `${h}h` : ""}${m ? ` ${m}m` : ""}`.trim();
}

function dayOfYear(y: number, m: number, d: number): number {
  const start = Date.UTC(y, 0, 1);
  const cur = Date.UTC(y, m - 1, d);
  return Math.floor((cur - start) / 86400000) + 1;
}

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

function mod360(x: number): number {
  return ((x % 360) + 360) % 360;
}

/**
 * Sunrise/sunset for the given local calendar date at (lat, lon), using the
 * classic "Sunrise Equation" (Almanac for Computers, 1990). Returns instants
 * in UTC, or null if the sun does not rise/set that day at that latitude.
 */
function calcSunEvent(y: number, m: number, d: number, lat: number, lon: number, isRise: boolean): Date | null {
  const zenith = 90.833;
  const N = dayOfYear(y, m, d);
  const lngHour = lon / 15;
  const t = isRise ? N + (6 - lngHour) / 24 : N + (18 - lngHour) / 24;

  const M = 0.9856 * t - 3.289;
  let L = M + 1.916 * Math.sin(M * D2R) + 0.02 * Math.sin(2 * M * D2R) + 282.634;
  L = mod360(L);

  let RA = R2D * Math.atan(0.91764 * Math.tan(L * D2R));
  RA = mod360(RA);
  const Lquadrant = Math.floor(L / 90) * 90;
  const RAquadrant = Math.floor(RA / 90) * 90;
  RA = (RA + (Lquadrant - RAquadrant)) / 15;

  const sinDec = 0.39782 * Math.sin(L * D2R);
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(zenith * D2R) - sinDec * Math.sin(lat * D2R)) / (cosDec * Math.cos(lat * D2R));
  if (cosH > 1 || cosH < -1) return null;

  let H = isRise ? 360 - R2D * Math.acos(cosH) : R2D * Math.acos(cosH);
  H = H / 15;

  const T = H + RA - 0.06571 * t - 6.622;
  const UT = mod360(T * 15) / 15;

  const ms = Date.UTC(y, m - 1, d) + UT * 3600 * 1000;
  return new Date(ms);
}

export interface SunTimes {
  sunrise: Date | null;
  sunset: Date | null;
}

export function getSunTimes(date: Date, lat: number, lon: number, timeZone: string): SunTimes {
  const { y, m, d } = getLocalYMD(date, timeZone);
  return {
    sunrise: calcSunEvent(y, m, d, lat, lon, true),
    sunset: calcSunEvent(y, m, d, lat, lon, false),
  };
}

export function isDaytime(now: Date, sun: SunTimes): boolean {
  if (!sun.sunrise || !sun.sunset) return true;
  return now >= sun.sunrise && now < sun.sunset;
}

/** The next sunrise/sunset instant strictly after `now` (rolls over to the
 * following day once today's events have already passed). */
export function getNextSunEvent(now: Date, lat: number, lon: number, timeZone: string, kind: "sunrise" | "sunset"): Date | null {
  const today = getSunTimes(now, lat, lon, timeZone)[kind];
  if (today && today > now) return today;
  const tomorrow = new Date(now.getTime() + 24 * 3600 * 1000);
  return getSunTimes(tomorrow, lat, lon, timeZone)[kind];
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export type DayCategory = "sleeping" | "waking" | "business" | "evening";

/** Simple, deterministic day-part model used for the conversion matrix. */
export function categorizeHour(hour: number): DayCategory {
  if (hour < 6) return "sleeping";
  if (hour < 9) return "waking";
  if (hour < 18) return "business";
  if (hour < 22) return "evening";
  return "sleeping";
}

export const DAY_CATEGORY_LABEL: Record<DayCategory, string> = {
  sleeping: "Sleeping",
  waking: "Waking",
  business: "Business Hours",
  evening: "Evening",
};

/** Builds the absolute instant for a given wall-clock date/time in a time zone. */
export function zonedTimeToInstant(y: number, m: number, d: number, hour: number, minute: number, timeZone: string): Date {
  let guessMs = Date.UTC(y, m - 1, d, hour, minute);
  for (let i = 0; i < 2; i++) {
    const offset = getOffsetMinutes(timeZone, new Date(guessMs));
    guessMs = Date.UTC(y, m - 1, d, hour, minute) - offset * 60000;
  }
  return new Date(guessMs);
}

export interface TimeOption {
  instant: Date;
  label: string;
}

/** Half-hour increments across the given zone's current calendar day. */
export function getTimeOptionsForDay(reference: Date, timeZone: string, hour12: boolean): TimeOption[] {
  const { y, m, d } = getLocalYMD(reference, timeZone);
  const options: TimeOption[] = [];
  for (let slot = 0; slot < 48; slot++) {
    const hour = Math.floor(slot / 2);
    const minute = (slot % 2) * 30;
    const instant = zonedTimeToInstant(y, m, d, hour, minute, timeZone);
    options.push({ instant, label: formatTimeShort(instant, timeZone, hour12) });
  }
  return options;
}

export function getHourInZone(date: Date, timeZone: string): number {
  const map = partsToMap(
    new Intl.DateTimeFormat("en-US", { timeZone, hourCycle: "h23", hour: "numeric", minute: "numeric" }).formatToParts(
      date,
    ),
  );
  return Number(map.hour ?? 0) + Number(map.minute ?? 0) / 60;
}

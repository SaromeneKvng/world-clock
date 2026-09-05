import type { City } from "./cities";
import {
  formatShortDate,
  getOffsetMinutes,
  getRelativeOffsetLabel,
  getSunTimes,
  getTimeParts,
  isDaytime,
} from "./time";

export interface CityInfo {
  hour: string;
  minute: string;
  dayPeriod: string;
  dateLabel: string;
  offsetMinutes: number;
  isDay: boolean;
  relativeLabel: string;
}

export function getCityInfo(city: City, now: Date, hour12: boolean, referenceOffsetMinutes: number): CityInfo {
  const time = getTimeParts(now, city.timeZone, hour12);
  const offsetMinutes = getOffsetMinutes(city.timeZone, now);
  const sun = getSunTimes(now, city.lat, city.lon, city.timeZone);

  return {
    hour: time.hour,
    minute: time.minute,
    dayPeriod: time.dayPeriod,
    dateLabel: formatShortDate(now, city.timeZone),
    offsetMinutes,
    isDay: isDaytime(now, sun),
    relativeLabel: getRelativeOffsetLabel(offsetMinutes, referenceOffsetMinutes),
  };
}

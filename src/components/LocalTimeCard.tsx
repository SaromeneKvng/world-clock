import type { LocalPlace } from "../hooks/useLocalPlace";
import {
  formatDuration,
  formatFullDate,
  getNextSunEvent,
  getOffsetMinutes,
  getSunTimes,
  getTimeParts,
  getTimeZoneAbbreviation,
  isDaytime,
} from "../lib/time";
import { MoonIcon, SunIcon, SunriseIcon, SunsetIcon } from "./icons";

interface LocalTimeCardProps {
  place: LocalPlace;
  now: Date;
  hour12: boolean;
}

export function LocalTimeCard({ place, now, hour12 }: LocalTimeCardProps) {
  const time = getTimeParts(now, place.timeZone, hour12);
  const offsetMinutes = getOffsetMinutes(place.timeZone, now);
  const abbrev = getTimeZoneAbbreviation(place.timeZone, now);
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const gmtOffset = `GMT ${sign}${Math.floor(Math.abs(offsetMinutes) / 60)}`;
  const gmtLabel = abbrev && abbrev !== gmtOffset.replace(" ", "") ? `${gmtOffset} (${abbrev})` : gmtOffset;

  const sun = place.lat != null && place.lon != null ? getSunTimes(now, place.lat, place.lon, place.timeZone) : null;
  const daytime = sun ? isDaytime(now, sun) : true;

  let nightLabel: string | null = null;
  if (place.lat != null && place.lon != null) {
    const next = getNextSunEvent(now, place.lat, place.lon, place.timeZone, daytime ? "sunset" : "sunrise");
    if (next) nightLabel = `For ${formatDuration(next.getTime() - now.getTime())} more`;
  }

  return (
    <div className="flex w-full flex-col items-end gap-6 overflow-hidden rounded-[28px] bg-white p-5 xs:p-6 sm:gap-[38px] sm:p-8 dark:bg-[#141416]">
      <div className="relative w-full border-b border-[#f1f5f9] pb-6 sm:pb-9 dark:border-white/10">
        <p className="text-[14px] uppercase tracking-[-0.56px] text-zinc-400 dark:text-white/40">Your local time</p>
        <div className="flex items-center gap-2 py-2 text-black xs:gap-3 sm:gap-4 dark:text-white">
          <span className="font-display text-[56px] leading-none font-semibold xs:text-[76px] sm:text-[128px]">
            {time.hour}:{time.minute}
          </span>
          {hour12 && (
            <span className="font-display text-[16px] tracking-[-0.96px] xs:text-[20px] sm:text-[24px]">
              {time.dayPeriod}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-display text-[20px] font-medium text-black dark:text-white">
            {place.name}
            {place.country ? `, ${place.country}` : ""}
          </p>
          <p className="text-base text-zinc-400 dark:text-white/40">{formatFullDate(now, place.timeZone)}</p>
          <p className="text-base text-zinc-400 dark:text-white/40">{gmtLabel}</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-[26px]">
        <div className="flex items-center gap-4 sm:contents">
          {sun?.sunrise && (
            <div className="flex flex-1 items-center gap-2 sm:w-[171px] sm:flex-none">
              <SunriseIcon className="size-[18px] shrink-0 text-orange-400" />
              <div className="flex flex-1 flex-col text-xs">
                <span className="text-zinc-400 dark:text-white/40">Sunrise</span>
                <span className="text-black dark:text-white">{getTimeParts(sun.sunrise, place.timeZone, hour12).hour}:{getTimeParts(sun.sunrise, place.timeZone, hour12).minute}{hour12 ? ` ${getTimeParts(sun.sunrise, place.timeZone, hour12).dayPeriod}` : ""}</span>
              </div>
            </div>
          )}
          {sun?.sunset && (
            <div className="flex flex-1 items-center gap-2">
              <SunsetIcon className="size-[18px] shrink-0 text-orange-400" />
              <div className="flex flex-1 flex-col text-xs">
                <span className="text-zinc-400 dark:text-white/40">Sunset</span>
                <span className="text-black dark:text-white">{getTimeParts(sun.sunset, place.timeZone, hour12).hour}:{getTimeParts(sun.sunset, place.timeZone, hour12).minute}{hour12 ? ` ${getTimeParts(sun.sunset, place.timeZone, hour12).dayPeriod}` : ""}</span>
              </div>
            </div>
          )}
        </div>
        {nightLabel && (
          <div className="flex h-8 w-full shrink-0 items-center gap-1.5 rounded-2xl bg-[#f5f5f5] px-3 py-2 sm:w-auto dark:bg-white/5">
            {daytime ? <SunIcon className="size-4 text-orange-500" /> : <MoonIcon className="size-4 text-blue-700 dark:text-blue-300" />}
            <span className="truncate text-xs text-black dark:text-white">
              {daytime ? "Day" : "Night"} time in {place.name}
            </span>
            <span className="shrink-0 text-xs whitespace-nowrap text-zinc-500 dark:text-white/40">{nightLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

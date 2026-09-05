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
    <div className="flex w-full flex-col items-end gap-[38px] overflow-hidden rounded-[28px] bg-white p-8 dark:bg-[#141416]">
      <div className="relative w-full border-b border-[#f1f5f9] pb-9 dark:border-white/10">
        <p className="text-[14px] uppercase tracking-[-0.56px] text-zinc-400 dark:text-white/40">Your local time</p>
        <div className="flex items-center gap-4 py-2 text-black dark:text-white">
          <span className="font-display text-[96px] font-semibold leading-none sm:text-[128px]">
            {time.hour}:{time.minute}
          </span>
          {hour12 && <span className="font-display text-[24px] tracking-[-0.96px]">{time.dayPeriod}</span>}
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

      <div className="flex w-full items-center gap-[26px]">
        {sun?.sunrise && (
          <div className="flex w-[171px] items-center gap-2">
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
        {nightLabel && (
          <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-2xl bg-[#f5f5f5] px-3 py-2 dark:bg-white/5">
            {daytime ? <SunIcon className="size-4 text-orange-500" /> : <MoonIcon className="size-4 text-blue-700 dark:text-blue-300" />}
            <span className="whitespace-nowrap text-xs text-black dark:text-white">
              {daytime ? "Day" : "Night"} time in {place.name}
            </span>
            <span className="whitespace-nowrap text-xs text-zinc-500 dark:text-white/40">{nightLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

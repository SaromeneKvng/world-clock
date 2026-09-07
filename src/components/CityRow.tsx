import type { City } from "../lib/cities";
import { getCityInfo } from "../lib/cityInfo";
import { formatSignedOffset, formatUtcOffset, getTimeZoneAbbreviation } from "../lib/time";
import { MoonIcon, SunIcon, XIcon } from "./icons";

interface CityRowProps {
  city: City;
  now: Date;
  hour12: boolean;
  referenceOffsetMinutes: number;
  onRemove: () => void;
  roundedTop?: boolean;
  roundedBottom?: boolean;
}

export function CityRow({ city, now, hour12, referenceOffsetMinutes, onRemove, roundedTop, roundedBottom }: CityRowProps) {
  const info = getCityInfo(city, now, hour12, referenceOffsetMinutes);
  const abbrev = getTimeZoneAbbreviation(city.timeZone, now);

  return (
    <div
      className={`group relative flex w-full flex-col gap-2 border-[0.5px] border-[#f1f5f9] bg-white px-4 py-3 pr-11 sm:flex-row sm:items-center sm:gap-14 sm:px-6 sm:py-4 sm:pr-6 dark:border-white/5 dark:bg-[#141416] ${
        roundedTop ? "rounded-t-xl" : ""
      } ${roundedBottom ? "rounded-b-xl" : ""}`}
    >
      <div className="flex w-full items-start justify-between gap-3 sm:contents">
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="font-display text-[18px] text-black dark:text-white">{city.name}</p>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm text-zinc-400 dark:text-white/40">{city.country}</p>
            <div className="flex items-center gap-1 text-xs text-zinc-400 dark:text-white/40">
              <span>{abbrev}</span>
              <span className="size-1 rounded-full bg-current opacity-50" />
              <span>{formatUtcOffset(info.offsetMinutes)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-end gap-1 sm:items-start">
          <div className="flex h-10 items-center gap-1 whitespace-nowrap text-black dark:text-white">
            <span className="font-display text-[32px] font-medium">
              {info.hour}:{info.minute}
            </span>
            {hour12 && <span className="text-base">{info.dayPeriod}</span>}
          </div>
          <p className="text-xs text-zinc-400 dark:text-white/40">{info.dateLabel}</p>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-3 sm:contents">
        <div className="flex items-center justify-start sm:flex-1 sm:justify-center">
          <div
            className={`flex items-center gap-1 rounded-2xl px-2 py-1.5 ${
              info.isDay ? "bg-orange-50 dark:bg-orange-500/10" : "bg-blue-50 dark:bg-blue-500/10"
            }`}
          >
            {info.isDay ? (
              <SunIcon className="size-3.5 text-orange-500" />
            ) : (
              <MoonIcon className="size-3.5 text-blue-700 dark:text-blue-300" />
            )}
            <span className={`text-sm tracking-[-0.28px] ${info.isDay ? "text-orange-600" : "text-blue-700 dark:text-blue-300"}`}>
              {info.isDay ? "Day" : "Night"}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-end gap-0.5 sm:items-start">
          <p className="text-[18px] text-black dark:text-white">{formatSignedOffset(info.offsetMinutes - referenceOffsetMinutes)}</p>
          <p className="text-xs text-amber-600 dark:text-amber-400">{info.relativeLabel}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${city.name}`}
        className="absolute top-3 right-3 flex size-6 shrink-0 items-center justify-center rounded-full text-zinc-300 opacity-100 transition-opacity hover:bg-zinc-100 hover:text-zinc-600 sm:static sm:top-auto sm:right-auto sm:opacity-0 sm:group-hover:opacity-100 dark:text-white/20 dark:hover:bg-white/10 dark:hover:text-white/70"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}

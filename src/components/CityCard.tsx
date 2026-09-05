import type { City } from "../lib/cities";
import { getCityInfo } from "../lib/cityInfo";
import { formatUtcOffset } from "../lib/time";
import { MoonIcon, SunIcon, XIcon } from "./icons";

interface CityCardProps {
  city: City;
  now: Date;
  hour12: boolean;
  referenceOffsetMinutes: number;
  onRemove: () => void;
}

export function CityCard({ city, now, hour12, referenceOffsetMinutes, onRemove }: CityCardProps) {
  const info = getCityInfo(city, now, hour12, referenceOffsetMinutes);

  return (
    <div className="group relative flex flex-col gap-4 rounded-xl border border-black/[0.02] bg-white px-3 py-4 dark:border-white/5 dark:bg-[#141416]">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${city.name}`}
        className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full text-zinc-300 opacity-0 transition-opacity hover:bg-zinc-100 hover:text-zinc-600 group-hover:opacity-100 dark:text-white/20 dark:hover:bg-white/10 dark:hover:text-white/70"
      >
        <XIcon className="size-3.5" />
      </button>

      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="font-display text-[18px] text-black dark:text-white">{city.name}</p>
          <p className="text-sm text-zinc-400 dark:text-white/40">{city.country}</p>
        </div>
        <div
          className={`flex h-6 shrink-0 items-center gap-1 rounded-2xl px-2 py-1.5 ${
            info.isDay ? "bg-orange-50 dark:bg-orange-500/10" : "bg-blue-50 dark:bg-blue-500/10"
          }`}
        >
          {info.isDay ? (
            <SunIcon className="size-3 text-orange-500" />
          ) : (
            <MoonIcon className="size-3 text-blue-700 dark:text-blue-300" />
          )}
          <span className={`text-xs tracking-[-0.24px] ${info.isDay ? "text-orange-600" : "text-blue-700 dark:text-blue-300"}`}>
            {info.isDay ? "Day" : "Night"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 whitespace-nowrap text-black dark:text-white">
          <span className="font-display text-[32px] font-medium">
            {info.hour}:{info.minute}
          </span>
          {hour12 && <span className="text-base">{info.dayPeriod}</span>}
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-white/40">
          <span>{formatUtcOffset(info.offsetMinutes)}</span>
          <span>{info.dateLabel}</span>
        </div>
        <p className="text-xs text-orange-600 dark:text-orange-400">{info.relativeLabel}</p>
      </div>
    </div>
  );
}

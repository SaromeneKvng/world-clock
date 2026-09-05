import type { City } from "../lib/cities";
import { getTimeZoneAbbreviation } from "../lib/time";
import { ChevronDownIcon } from "./icons";

interface CitySelectFieldProps {
  city: City;
  now: Date;
  onClick: () => void;
}

export function CitySelectField({ city, now, onClick }: CitySelectFieldProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-[#e5e7eb] px-6 py-3 text-left transition-colors hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20"
    >
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="font-display text-base font-medium text-black dark:text-white">{city.name}</p>
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span>{city.country}</span>
          <span className="size-[5px] rounded-full bg-current opacity-50" />
          <span>{getTimeZoneAbbreviation(city.timeZone, now)}</span>
        </div>
      </div>
      <ChevronDownIcon className="size-6 shrink-0 text-black dark:text-white" />
    </button>
  );
}

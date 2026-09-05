import type { City } from "../lib/cities";
import { categorizeHour, formatUtcOffset, getHourInZone, getOffsetMinutes, getTimeOptionsForDay, getTimeParts } from "../lib/time";
import { CategoryBadge } from "./CategoryBadge";
import { TimeSlotSelect } from "./TimeSlotSelect";

interface TimeDetailCardProps {
  label: string;
  city: City;
  instant: Date;
  hour12: boolean;
  onSetInstant: (instant: Date) => void;
}

export function TimeDetailCard({ label, city, instant, hour12, onSetInstant }: TimeDetailCardProps) {
  const time = getTimeParts(instant, city.timeZone, hour12);
  const offsetMinutes = getOffsetMinutes(city.timeZone, instant);
  const category = categorizeHour(getHourInZone(instant, city.timeZone));
  const options = getTimeOptionsForDay(instant, city.timeZone, hour12);

  const selectedIndex = options.reduce((best, opt, i) => {
    const bestDiff = Math.abs(options[best].instant.getTime() - instant.getTime());
    const diff = Math.abs(opt.instant.getTime() - instant.getTime());
    return diff < bestDiff ? i : best;
  }, 0);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden rounded-[20px] bg-white px-6 py-6 dark:bg-[#141416]">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm tracking-[-0.28px] text-[#92939e] uppercase">{label}</p>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span className="font-display text-xl font-medium text-black dark:text-white">{city.name}</span>
          <span className="text-sm text-[#92939e]">{city.country}</span>
        </div>
      </div>

      <TimeSlotSelect
        label={`Set ${city.name} time:`}
        options={options}
        selectedIndex={selectedIndex}
        onChange={(i) => onSetInstant(options[i].instant)}
      />

      <div className="flex w-full flex-col items-start rounded-2xl bg-[#fafafa] px-4 pt-3 pb-4 dark:bg-white/5">
        <div className="flex w-full items-center justify-between border-b border-[#e3e3e3] pb-1 font-display text-black dark:border-white/10 dark:text-white">
          <span className="text-[32px] font-medium whitespace-nowrap">
            {time.hour}:{time.minute}
          </span>
          {hour12 && <span className="text-base">{time.dayPeriod}</span>}
        </div>
        <div className="flex w-full items-center justify-between pt-1 text-sm text-[#92939e]">
          <span>
            {new Intl.DateTimeFormat("en-US", { timeZone: city.timeZone, weekday: "short", month: "short", day: "numeric" }).format(
              instant,
            )}
          </span>
          <span>{formatUtcOffset(offsetMinutes)}</span>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <CategoryBadge category={category} />
        <p className="text-sm text-[#92939e] whitespace-nowrap">{city.timeZone}</p>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import type { City } from "../lib/cities";
import {
  categorizeHour,
  getLocalYMD,
  getTimeParts,
  zonedTimeToInstant,
  type DayCategory,
} from "../lib/time";
import { BriefcaseIcon, SunIcon } from "./icons";

interface ConversionMatrixProps {
  origin: City;
  target: City;
  reference: Date;
  hour12: boolean;
}

type Suitability = "work-overlap" | "both-awake" | "outside";

interface MatrixRow {
  hour: number;
  originLabel: string;
  originCategory: DayCategory;
  targetLabel: string;
  targetCategory: DayCategory;
  dayOffset: number;
  suitability: Suitability;
}

const AWAKE: DayCategory[] = ["waking", "business", "evening"];

function daysBetween(a: { y: number; m: number; d: number }, b: { y: number; m: number; d: number }): number {
  const aMs = Date.UTC(a.y, a.m - 1, a.d);
  const bMs = Date.UTC(b.y, b.m - 1, b.d);
  return Math.round((bMs - aMs) / 86400000);
}

function buildRows(origin: City, target: City, reference: Date, hour12: boolean): MatrixRow[] {
  const originYmd = getLocalYMD(reference, origin.timeZone);
  const rows: MatrixRow[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const instant = zonedTimeToInstant(originYmd.y, originYmd.m, originYmd.d, hour, 0, origin.timeZone);
    const originCategory = categorizeHour(hour);
    const targetTime = getTimeParts(instant, target.timeZone, hour12);
    const targetYmd = getLocalYMD(instant, target.timeZone);
    const targetHour = Number(
      new Intl.DateTimeFormat("en-US", { timeZone: target.timeZone, hourCycle: "h23", hour: "numeric" }).format(instant),
    );
    const targetCategory = categorizeHour(targetHour);

    let suitability: Suitability = "outside";
    if (originCategory === "business" && targetCategory === "business") suitability = "work-overlap";
    else if (AWAKE.includes(originCategory) && AWAKE.includes(targetCategory)) suitability = "both-awake";

    rows.push({
      hour,
      originLabel: `${getTimeParts(instant, origin.timeZone, hour12).hour}:${getTimeParts(instant, origin.timeZone, hour12).minute}${
        hour12 ? ` ${getTimeParts(instant, origin.timeZone, hour12).dayPeriod}` : ""
      }`,
      originCategory,
      targetLabel: `${targetTime.hour}:${targetTime.minute}${hour12 ? ` ${targetTime.dayPeriod}` : ""}`,
      targetCategory,
      dayOffset: daysBetween(originYmd, targetYmd),
      suitability,
    });
  }
  return rows;
}

function CategoryText({ category }: { category: DayCategory }) {
  if (category === "sleeping") {
    return <span className="rounded-2xl bg-[#f5f5f5] px-2 py-1 text-sm text-[#3f3f46] dark:bg-white/5 dark:text-white/60">Sleeping</span>;
  }
  if (category === "business") {
    return (
      <span className="rounded-2xl bg-[#f0fdf4] px-2 py-1 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400">
        Business Hours
      </span>
    );
  }
  if (category === "waking") {
    return <span className="text-sm text-amber-600 dark:text-amber-400">Waking</span>;
  }
  return <span className="text-sm text-violet-600 dark:text-violet-400">Evening</span>;
}

function SuitabilityText({ suitability }: { suitability: Suitability }) {
  if (suitability === "work-overlap") {
    return (
      <span className="flex items-center justify-end gap-1 text-sm text-green-700 dark:text-green-400">
        <BriefcaseIcon className="size-3.5" />
        Work Overlap
      </span>
    );
  }
  if (suitability === "both-awake") {
    return (
      <span className="flex items-center justify-end gap-1 text-sm text-orange-600 dark:text-orange-400">
        <SunIcon className="size-3.5" />
        Both awake
      </span>
    );
  }
  return <span className="text-sm text-zinc-400 dark:text-white/40">Outside Normal Hours</span>;
}

const FILTERS = [
  { id: "all", label: "Full 24 Hours" },
  { id: "awake", label: "Both Awake" },
  { id: "overlap", label: "Work overlap" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export function ConversionMatrix({ origin, target, reference, hour12 }: ConversionMatrixProps) {
  const [filter, setFilter] = useState<FilterId>("all");
  const rows = useMemo(() => buildRows(origin, target, reference, hour12), [origin, target, reference, hour12]);

  const awakeCount = rows.filter((r) => r.suitability !== "outside").length;
  const overlapCount = rows.filter((r) => r.suitability === "work-overlap").length;

  const counts: Record<FilterId, number> = { all: 24, awake: awakeCount, overlap: overlapCount };

  const visibleRows = rows.filter((r) => {
    if (filter === "awake") return r.suitability !== "outside";
    if (filter === "overlap") return r.suitability === "work-overlap";
    return true;
  });

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-[39px]">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex flex-1 flex-col gap-1">
          <p className="font-display text-xl font-medium text-black dark:text-white">Time Conversion Matrix</p>
          <p className="text-sm tracking-[-0.14px] text-[#92939e]">Browse corresponding local times, day offsets, and call suitability</p>
        </div>
        <div className="-mx-1 max-w-full overflow-x-auto px-1 sm:mx-0 sm:px-0">
          <div className="flex h-10 w-max items-center rounded-full bg-white p-0.5 dark:bg-white/5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`flex h-full items-center justify-center rounded-full px-2 text-xs whitespace-nowrap transition-colors ${
                  filter === f.id ? "bg-[#f7f7f7] text-black dark:bg-white/10 dark:text-white" : "text-[#92939e]"
                }`}
              >
                {f.label} ({counts[f.id]}h)
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl">
        <div className="flex w-full min-w-[640px] flex-col overflow-hidden rounded-xl">
          <div className="flex w-full items-center gap-14 border border-[#ededed] bg-[#e5e5e5] px-6 py-4 dark:border-white/10 dark:bg-white/10">
            <p className="flex-1 text-base text-black dark:text-white">
              {origin.name} <span className="text-[#92939e]">({new Intl.DateTimeFormat("en-US", { timeZone: origin.timeZone, timeZoneName: "short" }).formatToParts(reference).find((p) => p.type === "timeZoneName")?.value})</span>
            </p>
            <p className="flex-1 text-base text-black dark:text-white">
              {target.name} <span className="text-[#92939e]">({new Intl.DateTimeFormat("en-US", { timeZone: target.timeZone, timeZoneName: "short" }).formatToParts(reference).find((p) => p.type === "timeZoneName")?.value})</span>
            </p>
            <p className="flex-1 text-right text-base text-black dark:text-white">Suitability</p>
          </div>

          <div className="flex max-h-[520px] w-full flex-col overflow-y-auto">
            {visibleRows.map((row) => (
              <div
                key={row.hour}
                className="flex w-full items-center gap-14 border-[0.5px] border-[#ededed] bg-white px-6 py-4 dark:border-white/5 dark:bg-[#141416]"
              >
                <div className="flex flex-1 items-center gap-2">
                  <span className="w-[75px] shrink-0 text-base text-black dark:text-white">{row.originLabel}</span>
                  <CategoryText category={row.originCategory} />
                </div>
                <div className="flex flex-1 items-center gap-2">
                  <span className="w-[75px] shrink-0 text-base text-black dark:text-white">{row.targetLabel}</span>
                  {row.dayOffset !== 0 && (
                    <span className="rounded-xl border border-[#ededed] px-3 py-1 text-sm text-[#52525b] dark:border-white/10 dark:text-white/60">
                      {row.dayOffset > 0 ? "+" : ""}
                      {row.dayOffset} Day
                    </span>
                  )}
                  <CategoryText category={row.targetCategory} />
                </div>
                <div className="flex flex-1 justify-end">
                  <SuitabilityText suitability={row.suitability} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

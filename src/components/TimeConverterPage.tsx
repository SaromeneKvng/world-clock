import { useMemo, useState } from "react";
import { CITIES, findCity } from "../lib/cities";
import { CitySelectField } from "./CitySelectField";
import { CityPickerDialog } from "./CityPickerDialog";
import { ConversionMatrix } from "./ConversionMatrix";
import { PageHeading } from "./PageHeading";
import { TimeDetailCard } from "./TimeDetailCard";
import { ArrowLeftRightIcon } from "./icons";
import { formatUtcOffset, getOffsetMinutes } from "../lib/time";

interface TimeConverterPageProps {
  now: Date;
  hour12: boolean;
  onHour12Change: (hour12: boolean) => void;
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
  defaultOriginId: string;
}

const QUICK_COMPARISONS: { label: string; originId: string; targetId: string }[] = [
  { label: "Japan ⇄ London", originId: "tokyo", targetId: "london" },
  { label: "San Francisco ⇄ Tokyo", originId: "san-francisco", targetId: "tokyo" },
  { label: "Los Angeles ⇄ Sydney", originId: "los-angeles", targetId: "sydney" },
  { label: "Paris ⇄ Dubai", originId: "paris", targetId: "dubai" },
  { label: "Berlin ⇄ New York", originId: "berlin", targetId: "new-york" },
];

export function TimeConverterPage({ now, hour12, onHour12Change, dark, onDarkChange, defaultOriginId }: TimeConverterPageProps) {
  const [originId, setOriginId] = useState(defaultOriginId);
  const [targetId, setTargetId] = useState(defaultOriginId === "new-york" ? "london" : "new-york");
  const [manualInstant, setManualInstant] = useState<Date | null>(null);
  const [pickerFor, setPickerFor] = useState<"origin" | "target" | null>(null);

  const origin = findCity(originId) ?? CITIES[0];
  const target = findCity(targetId) ?? CITIES[1];
  const instant = manualInstant ?? now;

  const originOffset = getOffsetMinutes(origin.timeZone, instant);
  const targetOffset = getOffsetMinutes(target.timeZone, instant);

  const excludeForOrigin = useMemo(() => [targetId], [targetId]);
  const excludeForTarget = useMemo(() => [originId], [originId]);

  return (
    <div className="flex w-full flex-col gap-12">
      <PageHeading
        title="Time Converter"
        subtitle="Simultaneous multi-timezone conversion"
        hour12={hour12}
        onHour12Change={onHour12Change}
        dark={dark}
        onDarkChange={onDarkChange}
      />

      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-8 rounded-[28px] bg-white p-8 dark:bg-[#141416]">
          <div className="flex w-full items-center gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center justify-between text-sm tracking-[-0.28px] text-zinc-400 uppercase">
                <span>From city (origin)</span>
                <span className="font-medium text-black dark:text-white">{formatUtcOffset(originOffset)}</span>
              </div>
              <CitySelectField city={origin} now={instant} onClick={() => setPickerFor("origin")} />
            </div>

            <button
              type="button"
              onClick={() => {
                setOriginId(targetId);
                setTargetId(originId);
              }}
              aria-label="Swap origin and target"
              className="mt-6 flex size-12 shrink-0 items-center justify-center rounded-full border border-[#d4d4d4] transition-colors hover:bg-slate-50 dark:border-white/15 dark:hover:bg-white/5"
            >
              <ArrowLeftRightIcon className="size-5 text-black dark:text-white" />
            </button>

            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center justify-between text-sm tracking-[-0.28px] text-zinc-400 uppercase">
                <span>To city (target)</span>
                <span className="font-medium text-black dark:text-white">{formatUtcOffset(targetOffset)}</span>
              </div>
              <CitySelectField city={target} now={instant} onClick={() => setPickerFor("target")} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <p className="text-sm text-zinc-500 uppercase dark:text-white/40">Quick comparisons</p>
            <div className="flex flex-wrap items-center gap-3">
              {QUICK_COMPARISONS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setOriginId(preset.originId);
                    setTargetId(preset.targetId);
                    setManualInstant(null);
                  }}
                  className="rounded-lg border border-[#e5e5e5] bg-[#f5f5f4] px-2 py-1 text-sm text-zinc-500 transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full items-center gap-4">
          <TimeDetailCard label="Origin Time" city={origin} instant={instant} hour12={hour12} onSetInstant={setManualInstant} />
          <TimeDetailCard label="Target Time" city={target} instant={instant} hour12={hour12} onSetInstant={setManualInstant} />
        </div>
      </div>

      <ConversionMatrix origin={origin} target={target} reference={instant} hour12={hour12} />

      {pickerFor && (
        <CityPickerDialog
          title={pickerFor === "origin" ? "Choose the origin city" : "Choose the target city"}
          excludeIds={pickerFor === "origin" ? excludeForOrigin : excludeForTarget}
          onSelect={(city) => (pickerFor === "origin" ? setOriginId(city.id) : setTargetId(city.id))}
          onClose={() => setPickerFor(null)}
        />
      )}
    </div>
  );
}

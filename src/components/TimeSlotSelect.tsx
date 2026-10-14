import { useEffect, useId, useRef, useState } from "react";
import { getLocalYMD, getTimeOptionsForDay, getTimeParts, zonedTimeToInstant } from "../lib/time";
import { ClockIcon } from "./icons";

interface TimeSlotSelectProps {
  label: string;
  timeZone: string;
  instant: Date;
  hour12: boolean;
  onChange: (instant: Date) => void;
}

export function TimeSlotSelect({ label, timeZone, instant, hour12, onChange }: TimeSlotSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const options = getTimeOptionsForDay(instant, timeZone, hour12);
  const selectedIndex = options.reduce((best, opt, i) => {
    const bestDiff = Math.abs(options[best].instant.getTime() - instant.getTime());
    const diff = Math.abs(opt.instant.getTime() - instant.getTime());
    return diff < bestDiff ? i : best;
  }, 0);

  const currentPeriod = getTimeParts(instant, timeZone, true).dayPeriod === "PM" ? "PM" : "AM";

  function setPeriod(period: "AM" | "PM") {
    if (!hour12 || period === currentPeriod) return;
    const wall = getTimeParts(instant, timeZone, false);
    const hour24 = Number(wall.hour);
    const minute = Number(wall.minute);
    const flipped = period === "AM" ? hour24 % 12 : (hour24 % 12) + 12;
    const { y, m, d } = getLocalYMD(instant, timeZone);
    onChange(zonedTimeToInstant(y, m, d, flipped, minute, timeZone));
  }

  function pick(index: number) {
    onChange(options[index].instant);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function move(delta: number) {
    const next = Math.min(Math.max(selectedIndex + delta, 0), options.length - 1);
    if (next !== selectedIndex) {
      onChange(options[next].instant);
      requestAnimationFrame(() => {
        listRef.current
          ?.querySelector<HTMLElement>(`[data-index="${next}"]`)
          ?.focus({ preventScroll: true });
      });
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      pick(0);
    } else if (e.key === "End") {
      e.preventDefault();
      pick(options.length - 1);
    }
  }

  // Close on outside click or Escape, returning focus to the trigger.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  // Centre the selected time when the panel opens.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`)
      ?.scrollIntoView({ block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open ]);

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-1">
      <p className="text-sm text-[#92939e]" id={labelId}>
        {label}
      </p>
      <div ref={rootRef} className="relative shrink-0">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg border border-[#e5e5e5] bg-[#fafaf9] px-2 py-1 text-sm text-[#757575] transition-colors outline-none hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-900/40 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:border-white/20 dark:focus-visible:ring-white/40"
        >
          <span className="tabular-nums">{options[selectedIndex].label}</span>
          <ClockIcon className="size-4" />
        </button>

        {open && (
          <div className="absolute top-full right-0 z-30 mt-2 flex w-36 max-w-[calc(100vw-2rem)] flex-col gap-1 rounded-2xl border border-[#e5e5e5] bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-[#18181b]">
            {hour12 && (
              <div
                role="group"
                aria-label="AM or PM"
                className="flex shrink-0 items-center rounded-full bg-[#f5f5f5] p-0.5 dark:bg-white/5"
              >
                {(["AM", "PM"] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    aria-pressed={currentPeriod === period}
                    onClick={() => setPeriod(period)}
                    className={`h-7 flex-1 rounded-full text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-900/40 dark:focus-visible:ring-white/40 ${
                      currentPeriod === period
                        ? "bg-white text-black shadow-sm dark:bg-white/10 dark:text-white"
                        : "text-[#92939e] hover:text-black dark:text-white/40 dark:hover:text-white"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          <div
            ref={listRef}
            role="listbox"
            aria-label={label}
            aria-labelledby={labelId}
            tabIndex={-1}
            onKeyDown={onKeyDown}
            className="flex max-h-56 flex-col gap-0.5 overflow-y-auto outline-none"
          >
            {options.map((opt, i) => {
              const isSelected = i === selectedIndex;
              return (
                <button
                  key={opt.instant.getTime()}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-index={i}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => pick(i)}
                  className={`flex shrink-0 items-center justify-center rounded-lg px-2 py-1.5 text-sm tabular-nums transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-900/40 dark:focus-visible:ring-white/40 ${
                    isSelected
                      ? "bg-slate-100 font-medium text-black dark:bg-white/10 dark:text-white"
                      : "text-[#757575] hover:bg-slate-50 dark:text-white/70 dark:hover:bg-white/5"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}

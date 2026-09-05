import type { TimeOption } from "../lib/time";
import { ChevronDownIcon } from "./icons";

interface TimeSlotSelectProps {
  label: string;
  options: TimeOption[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export function TimeSlotSelect({ label, options, selectedIndex, onChange }: TimeSlotSelectProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-sm text-[#92939e]">{label}</p>
      <div className="relative flex items-center gap-1 rounded-lg border border-[#e5e5e5] bg-[#fafaf9] px-2 py-1 dark:border-white/10 dark:bg-white/5">
        <select
          value={selectedIndex}
          onChange={(e) => onChange(Number(e.target.value))}
          className="appearance-none bg-transparent pr-4 text-sm text-[#757575] outline-none dark:text-white/70"
        >
          {options.map((opt, i) => (
            <option key={i} value={i}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-1.5 size-4 text-[#757575] dark:text-white/70" />
      </div>
    </div>
  );
}

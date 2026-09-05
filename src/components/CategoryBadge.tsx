import type { ReactNode } from "react";
import type { DayCategory } from "../lib/time";
import { BriefcaseIcon, MoonIcon, SunIcon } from "./icons";

const STYLES: Record<DayCategory, { bg: string; text: string; label: string; icon: (className: string) => ReactNode }> = {
  sleeping: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-800 dark:text-blue-300",
    label: "Night / Sleeping Hours",
    icon: (className) => <MoonIcon className={className} />,
  },
  waking: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    label: "Waking Hours",
    icon: (className) => <SunIcon className={className} />,
  },
  business: {
    bg: "bg-green-50 dark:bg-green-500/10",
    text: "text-green-800 dark:text-green-400",
    label: "Standard Business Hours",
    icon: (className) => <BriefcaseIcon className={className} />,
  },
  evening: {
    bg: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-300",
    label: "Evening",
    icon: (className) => <MoonIcon className={className} />,
  },
};

export function CategoryBadge({ category }: { category: DayCategory }) {
  const s = STYLES[category];
  return (
    <div className={`flex items-center gap-1 rounded-2xl px-2 py-1 ${s.bg}`}>
      {s.icon(`size-3.5 ${s.text}`)}
      <span className={`text-sm tracking-[-0.28px] whitespace-nowrap ${s.text}`}>{s.label}</span>
    </div>
  );
}

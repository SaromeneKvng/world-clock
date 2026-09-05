import { MoonIcon } from "./icons";

interface PageHeadingProps {
  title: string;
  subtitle: string;
  hour12: boolean;
  onHour12Change: (hour12: boolean) => void;
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
}

export function PageHeading({ title, subtitle, hour12, onHour12Change, dark, onDarkChange }: PageHeadingProps) {
  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex max-w-[420px] flex-col gap-1">
        <h1 className="font-display text-[32px] font-medium leading-tight text-black dark:text-white">{title}</h1>
        <p className="text-base text-zinc-400 dark:text-white/40">{subtitle}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="flex h-8 items-center overflow-hidden rounded-2xl">
          <button
            type="button"
            onClick={() => onHour12Change(true)}
            className={`h-full px-3 text-[15px] transition-colors ${
              hour12 ? "bg-blue-200 text-black" : "bg-white text-black dark:bg-white/5 dark:text-white/70"
            }`}
          >
            12H
          </button>
          <button
            type="button"
            onClick={() => onHour12Change(false)}
            className={`h-full px-3 text-[15px] transition-colors ${
              !hour12 ? "bg-blue-200 text-black" : "bg-white text-black dark:bg-white/5 dark:text-white/70"
            }`}
          >
            24H
          </button>
        </div>
        <button
          type="button"
          onClick={() => onDarkChange(!dark)}
          aria-label="Toggle dark mode"
          aria-pressed={dark}
          className="flex size-8 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-slate-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        >
          <MoonIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}

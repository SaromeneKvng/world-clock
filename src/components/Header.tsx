import { Logo } from "./icons";

interface HeaderProps {
  tab: "clock" | "converter";
  onTabChange: (tab: "clock" | "converter") => void;
}

export function Header({ tab, onTabChange }: HeaderProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      <Logo />

      <div className="flex items-center rounded-full border border-slate-300 bg-white p-[5px] dark:border-white/10 dark:bg-[#151517]">
        <button
          type="button"
          onClick={() => onTabChange("clock")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
            tab === "clock" ? "bg-slate-100 text-black dark:bg-white/10 dark:text-white" : "text-black dark:text-white/70"
          }`}
        >
          World clock
        </button>
        <button
          type="button"
          onClick={() => onTabChange("converter")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
            tab === "converter" ? "bg-slate-100 text-black dark:bg-white/10 dark:text-white" : "text-black dark:text-white/70"
          }`}
        >
          Time converter
        </button>
      </div>

      <Logo className="hidden opacity-0 sm:block" />
    </div>
  );
}

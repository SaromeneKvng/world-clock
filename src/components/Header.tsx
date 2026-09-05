import { Logo } from "./icons";

interface HeaderProps {
  tab: "clock" | "converter";
  onTabChange: (tab: "clock" | "converter") => void;
}

export function Header({ tab, onTabChange }: HeaderProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <Logo />

      <div className="flex items-center rounded-full border border-slate-300 bg-white p-[5px] dark:border-white/10 dark:bg-[#151517]">
        <button
          type="button"
          onClick={() => onTabChange("clock")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            tab === "clock" ? "bg-slate-100 text-black dark:bg-white/10 dark:text-white" : "text-black dark:text-white/70"
          }`}
        >
          World clock
        </button>
        <button
          type="button"
          onClick={() => onTabChange("converter")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            tab === "converter" ? "bg-slate-100 text-black dark:bg-white/10 dark:text-white" : "text-black dark:text-white/70"
          }`}
        >
          Time converter
        </button>
      </div>

      <Logo className="opacity-0" />
    </div>
  );
}

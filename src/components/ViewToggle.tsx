import { GridIcon, ListIcon, PlusIcon } from "./icons";

export type ViewMode = "list" | "grid";

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onAddCity: () => void;
}

export function ViewToggle({ view, onViewChange, onAddCity }: ViewToggleProps) {
  return (
    <div className="flex w-full items-center justify-between gap-3 sm:w-[261px] sm:gap-0">
      <div className="flex w-[132px] shrink-0 items-center justify-between rounded-2xl bg-white p-0.5 dark:bg-white/5">
        <button
          type="button"
          onClick={() => onViewChange("list")}
          className={`flex h-7 flex-1 items-center justify-center gap-1 rounded-2xl p-1 text-xs text-black transition-colors dark:text-white ${
            view === "list" ? "bg-[#f7f7f7] dark:bg-white/10" : ""
          }`}
        >
          <ListIcon className="size-3.5" />
          List
        </button>
        <button
          type="button"
          onClick={() => onViewChange("grid")}
          className={`flex h-7 flex-1 items-center justify-center gap-1 rounded-2xl p-1 text-xs text-black transition-colors dark:text-white ${
            view === "grid" ? "bg-[#f7f7f7] dark:bg-white/10" : ""
          }`}
        >
          <GridIcon className="size-3.5" />
          Grid
        </button>
      </div>
      <button
        type="button"
        onClick={onAddCity}
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-blue-900 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-800"
      >
        <PlusIcon className="size-4" />
        Add a city
      </button>
    </div>
  );
}

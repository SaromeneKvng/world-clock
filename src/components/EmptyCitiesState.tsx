import emptyState from "../assets/empty-state.svg";

export function EmptyCitiesState() {
  return (
    <div className="flex w-full flex-col items-center gap-1.5 py-8 text-center">
      <img src={emptyState} alt="" className="size-[104px]" />
      <p className="text-base tracking-[-0.64px] text-[#92939e] dark:text-white/40">Nothing added yet</p>
      <p className="font-display text-base text-black dark:text-white">Add a city to start comparing time zones.</p>
    </div>
  );
}

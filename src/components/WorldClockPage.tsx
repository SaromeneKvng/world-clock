import type { City } from "../lib/cities";
import { getOffsetMinutes } from "../lib/time";
import { CityPickerDialog } from "./CityPickerDialog";
import { CityCard } from "./CityCard";
import { CityRow } from "./CityRow";
import { EmptyCitiesState } from "./EmptyCitiesState";
import { LocalTimeCard } from "./LocalTimeCard";
import { PageHeading } from "./PageHeading";
import { ViewToggle, type ViewMode } from "./ViewToggle";
import type { LocalPlace } from "../hooks/useLocalPlace";

interface WorldClockPageProps {
  now: Date;
  hour12: boolean;
  onHour12Change: (hour12: boolean) => void;
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
  localPlace: LocalPlace;
  cities: City[];
  onAddCity: (city: City) => void;
  onRemoveCity: (id: string) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  addDialogOpen: boolean;
  onOpenAddDialog: () => void;
  onCloseAddDialog: () => void;
}

export function WorldClockPage({
  now,
  hour12,
  onHour12Change,
  dark,
  onDarkChange,
  localPlace,
  cities,
  onAddCity,
  onRemoveCity,
  view,
  onViewChange,
  addDialogOpen,
  onOpenAddDialog,
  onCloseAddDialog,
}: WorldClockPageProps) {
  const referenceOffsetMinutes = getOffsetMinutes(localPlace.timeZone, now);

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex w-full flex-col gap-[45px]">
        <PageHeading
          title="World Time Check"
          subtitle="What time is it there, right now?"
          hour12={hour12}
          onHour12Change={onHour12Change}
          dark={dark}
          onDarkChange={onDarkChange}
        />
        <LocalTimeCard place={localPlace} now={now} hour12={hour12} />
      </div>

      <div className="flex w-full flex-col gap-12">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="font-display text-base text-black dark:text-white">Your cities</p>
            <div className="flex size-7 items-center justify-center rounded-full bg-white text-sm text-black dark:bg-white/10 dark:text-white">
              {cities.length}
            </div>
          </div>
          <ViewToggle view={view} onViewChange={onViewChange} onAddCity={onOpenAddDialog} />
        </div>

        {cities.length === 0 ? (
          <EmptyCitiesState />
        ) : view === "grid" ? (
          <div className="grid w-full grid-cols-4 gap-2">
            {cities.map((city) => (
              <CityCard
                key={city.id}
                city={city}
                now={now}
                hour12={hour12}
                referenceOffsetMinutes={referenceOffsetMinutes}
                onRemove={() => onRemoveCity(city.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col">
            {cities.map((city, i) => (
              <CityRow
                key={city.id}
                city={city}
                now={now}
                hour12={hour12}
                referenceOffsetMinutes={referenceOffsetMinutes}
                onRemove={() => onRemoveCity(city.id)}
                roundedTop={i === 0}
                roundedBottom={i === cities.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {addDialogOpen && (
        <CityPickerDialog
          title="Add a city"
          excludeIds={cities.map((c) => c.id)}
          onSelect={onAddCity}
          onClose={onCloseAddDialog}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { TimeConverterPage } from "./components/TimeConverterPage";
import type { ViewMode } from "./components/ViewToggle";
import { WorldClockPage } from "./components/WorldClockPage";
import { useLocalPlace } from "./hooks/useLocalPlace";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useNow } from "./hooks/useNow";
import { type City } from "./lib/cities";
import { findCityAny, saveCustomCity } from "./lib/customCities";

type Tab = "clock" | "converter";

const DEFAULT_CITY_IDS: string[] = [];

function App() {
  const now = useNow();
  const devicePlace = useLocalPlace();

  const [tab, setTab] = useState<Tab>("clock");
  const [hour12, setHour12] = useLocalStorage("elsewhere:hour12", true);
  const [dark, setDark] = useLocalStorage("elsewhere:dark", false);
  const [view, setView] = useLocalStorage<ViewMode>("elsewhere:view", "grid");
  const [cityIds, setCityIds] = useLocalStorage<string[]>("elsewhere:cities", DEFAULT_CITY_IDS);
  const [localCityId, setLocalCityId] = useLocalStorage<string | null>("elsewhere:local-city", null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const cities: City[] = cityIds.map(findCityAny).filter((c): c is City => Boolean(c));

  const overrideCity = localCityId ? findCityAny(localCityId) : undefined;
  const localPlace = overrideCity
    ? {
        id: overrideCity.id,
        name: overrideCity.name,
        country: overrideCity.country,
        timeZone: overrideCity.timeZone,
        lat: overrideCity.lat,
        lon: overrideCity.lon,
      }
    : devicePlace;

  return (
    <div className="flex min-h-screen w-full flex-col items-center px-4 pt-8 pb-10 xs:px-6 sm:px-8 sm:pt-12 sm:pb-16 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 sm:gap-24">
      <Header tab={tab} onTabChange={setTab} />

      {tab === "clock" ? (
        <WorldClockPage
          now={now}
          hour12={hour12}
          onHour12Change={setHour12}
          dark={dark}
          onDarkChange={setDark}
          localPlace={localPlace}
          cities={cities}
          isLocalOverridden={overrideCity !== undefined}
          onSelectLocalCity={(city) => {
            saveCustomCity(city);
            setLocalCityId(city.id);
          }}
          onResetLocalCity={() => setLocalCityId(null)}
          onAddCity={(city) => {
            saveCustomCity(city);
            setCityIds((ids) => (ids.includes(city.id) ? ids : [...ids, city.id]));
          }}
          onRemoveCity={(id) => setCityIds((ids) => ids.filter((existing) => existing !== id))}
          view={view}
          onViewChange={setView}
          addDialogOpen={addDialogOpen}
          onOpenAddDialog={() => setAddDialogOpen(true)}
          onCloseAddDialog={() => setAddDialogOpen(false)}
        />
      ) : (
        <TimeConverterPage
          now={now}
          hour12={hour12}
          onHour12Change={setHour12}
          dark={dark}
          onDarkChange={setDark}
          defaultOriginId={localPlace.id ?? "tokyo"}
        />
      )}
      </div>
    </div>
  );
}

export default App;

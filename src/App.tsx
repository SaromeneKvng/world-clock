import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { TimeConverterPage } from "./components/TimeConverterPage";
import type { ViewMode } from "./components/ViewToggle";
import { WorldClockPage } from "./components/WorldClockPage";
import { useLocalPlace } from "./hooks/useLocalPlace";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useNow } from "./hooks/useNow";
import { type City, findCity } from "./lib/cities";

type Tab = "clock" | "converter";

const DEFAULT_CITY_IDS = ["tehran", "riyadh", "tokyo", "dhaka"];

function App() {
  const now = useNow();
  const localPlace = useLocalPlace();

  const [tab, setTab] = useState<Tab>("clock");
  const [hour12, setHour12] = useLocalStorage("elsewhere:hour12", true);
  const [dark, setDark] = useLocalStorage("elsewhere:dark", false);
  const [view, setView] = useLocalStorage<ViewMode>("elsewhere:view", "grid");
  const [cityIds, setCityIds] = useLocalStorage<string[]>("elsewhere:cities", DEFAULT_CITY_IDS);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const cities: City[] = cityIds.map(findCity).filter((c): c is City => Boolean(c));

  return (
    <div className="flex min-h-screen w-full flex-col items-start gap-24 px-6 pt-12 pb-16 sm:px-12 lg:px-[200px]">
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
          onAddCity={(city) => setCityIds((ids) => (ids.includes(city.id) ? ids : [...ids, city.id]))}
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
  );
}

export default App;

import { useEffect, useState } from "react";
import { Activity, MapPin, Sun, Zap, Wifi } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function DashboardHeader() {
  const [time, setTime] = useState<string>("");
  const [isDaytime, setIsDaytime] = useState(true);

  useEffect(() => {
    setIsDaytime(new Date().getHours() >= 6 && new Date().getHours() < 18);
  }, []);

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 sm:h-10 sm:w-10">
          <Activity className="h-4 w-4 text-cyan sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">SI-CEKAT</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">Smart IoT Kinetic Collector & Automated Tracker</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Badge variant="outline" className="gap-1.5 border-eco/40 bg-eco/10 text-eco">
          <span className="status-dot bg-eco" />
          Sistem Aktif
        </Badge>

        <Badge variant="secondary" className="hidden gap-1.5 font-normal text-muted-foreground sm:inline-flex">
          <MapPin className="h-3 w-3" />
          Sungai Brantas, Surabaya
        </Badge>

        <Badge variant="secondary" className="hidden gap-1.5 font-normal text-muted-foreground md:inline-flex">
          <Wifi className="h-3 w-3 text-cyan" />
          4G LTE
        </Badge>

        <Badge variant="secondary" className="gap-1.5 font-normal">
          {isDaytime ? (
            <Sun className="h-3.5 w-3.5 text-energy" />
          ) : (
            <Zap className="h-3.5 w-3.5 text-cyan" />
          )}
          <span>{isDaytime ? "Solar" : "Pico-Hydro"}</span>
        </Badge>

        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <span className="hidden font-mono text-sm tabular-nums text-foreground sm:inline">
          {time || "--:--:--"}
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}

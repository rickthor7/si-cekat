import { useEffect, useState, type ComponentType } from "react";
import { Battery, Radio, Wifi, MapPin, Ship } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function VesselStatus() {
  const batteryLevel = 78;
  const chargingActive = true;
  const ping = 42;

  const [MapComp, setMapComp] = useState<ComponentType | null>(null);

  useEffect(() => {
    let active = true;
    import("./VesselMap").then((mod) => {
      if (active) setMapComp(() => mod.default);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Ship className="h-4 w-4 text-cyan" />
          Vessel & Charging
        </CardTitle>
        <Badge variant="outline" className="border-eco/40 text-eco">Online</Badge>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Battery */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4 text-eco" />
              <span className="text-sm text-foreground">Baterai Kapal</span>
            </div>
            <span className="text-sm font-semibold tabular-nums text-eco">{batteryLevel}%</span>
          </div>
          <Progress value={batteryLevel} className="h-2 [&>div]:bg-eco" />
        </div>

        {/* Charging */}
        <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
          <div className="flex items-center gap-2">
            <Radio className={`h-4 w-4 ${chargingActive ? "text-cyan" : "text-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground">Qi Wireless Charging</span>
          </div>
          <Badge variant={chargingActive ? "default" : "secondary"} className={chargingActive ? "bg-cyan text-cyan-foreground" : ""}>
            {chargingActive ? "Active" : "Idle"}
          </Badge>
        </div>

        {/* Connectivity */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
            <Wifi className="h-3.5 w-3.5 text-cyan" />
            <span className="text-xs text-muted-foreground">Ping</span>
            <span className="ml-auto text-xs font-semibold tabular-nums text-foreground">{ping}ms</span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
            <Radio className="h-3.5 w-3.5 text-eco" />
            <span className="text-xs text-muted-foreground">LoRa</span>
            <span className="ml-auto text-xs font-semibold text-eco">OK</span>
          </div>
        </div>

        {/* Real Interactive Map (client-only) */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border sm:aspect-auto sm:h-[260px]">
          {MapComp ? (
            <MapComp />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted/30 text-xs text-muted-foreground">
              Memuat peta...
            </div>
          )}

          <Badge variant="outline" className="pointer-events-none absolute bottom-2 left-2 z-[400] gap-1.5 border-eco/40 bg-background/85 text-eco backdrop-blur-sm">
            <span className="status-dot bg-eco" />
            Patrol Aktif
          </Badge>
          <Badge variant="outline" className="pointer-events-none absolute right-2 top-2 z-[400] gap-1 border-cyan/40 bg-background/85 text-cyan backdrop-blur-sm">
            <MapPin className="h-3 w-3" />
            LIVE · Brantas
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

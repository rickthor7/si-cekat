import { Droplets, Thermometer, Eye, Waves } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const waterLevelData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  level: 1.2 + Math.sin(i / 3.8) * 0.4 + Math.random() * 0.15,
}));

const metrics = [
  { label: "pH Air", value: "7.2", unit: "", status: "Aman", icon: Droplets, iconColor: "text-cyan" },
  { label: "TDS", value: "120", unit: "ppm", status: "Baik", icon: Thermometer, iconColor: "text-eco" },
  { label: "Turbidity", value: "15", unit: "NTU", status: "Normal", icon: Eye, iconColor: "text-energy" },
];

export function WaterQuality() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Droplets className="h-4 w-4 text-cyan" />
          Kualitas Air
        </CardTitle>
        <Badge variant="outline" className="border-eco/40 text-eco">Real-time</Badge>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-border bg-muted/40 p-2.5 sm:p-3">
              <div className="flex items-center gap-1.5">
                <m.icon className={`h-3.5 w-3.5 ${m.iconColor}`} />
                <span className="truncate text-[11px] text-muted-foreground">{m.label}</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-semibold tabular-nums text-foreground sm:text-2xl">{m.value}</span>
                {m.unit && <span className="text-[10px] text-muted-foreground">{m.unit}</span>}
              </div>
              <Badge variant="secondary" className="mt-1 h-5 px-1.5 text-[10px] font-medium text-eco">{m.status}</Badge>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Waves className="h-3.5 w-3.5 text-cyan" />
            <span className="text-xs text-muted-foreground">Water Level — 24 Jam Terakhir</span>
          </div>
          <div className="h-36 w-full rounded-lg border border-border bg-muted/30 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterLevelData}>
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} interval={5} />
                <YAxis domain={[0.5, 2]} tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} width={30} tickFormatter={(v: number) => `${v.toFixed(1)}m`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--popover-foreground)",
                  }}
                  formatter={(value) => [`${Number(value).toFixed(2)} m`, "Level"]}
                />
                <Line type="monotone" dataKey="level" stroke="var(--cyan)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

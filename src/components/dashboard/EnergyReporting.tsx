import { Zap, Bell } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const energyData = [
  { month: "Jan", kinetik: 45, surya: 30, pln: 80 },
  { month: "Feb", kinetik: 52, surya: 35, pln: 80 },
  { month: "Mar", kinetik: 48, surya: 42, pln: 80 },
  { month: "Apr", kinetik: 55, surya: 50, pln: 80 },
  { month: "Mei", kinetik: 60, surya: 55, pln: 80 },
  { month: "Jun", kinetik: 58, surya: 48, pln: 80 },
];

const logs = [
  { time: "14:32", msg: "Kapal mendeteksi tumpukan plastik di koordinat -7.477, 112.505", type: "alert" },
  { time: "14:18", msg: "Docking Wireless Charging dimulai", type: "info" },
  { time: "13:55", msg: "Klasifikasi AI: 2.3 Kg plastik terdeteksi", type: "alert" },
  { time: "13:40", msg: "Water level normal: 1.2m", type: "info" },
  { time: "13:22", msg: "Bak penampung mencapai 60%", type: "warning" },
  { time: "12:50", msg: "Kapal kembali ke rute patrol otomatis", type: "info" },
];

export function EnergyReporting() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Zap className="h-4 w-4 text-energy" />
          Energy & Aktivitas
        </CardTitle>
        <Badge variant="outline" className="border-energy/40 text-energy">6 Bulan</Badge>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-energy" />
              <span className="text-xs text-muted-foreground">Energy Saved vs PLN (kWh)</span>
            </div>
            <div className="h-48 w-full rounded-lg border border-border bg-muted/30 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyData}>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} width={30} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "var(--popover-foreground)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                  <Bar dataKey="kinetik" name="Pico-Hydro" fill="var(--cyan)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="surya" name="Solar" fill="var(--energy)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="pln" name="PLN" fill="var(--muted-foreground)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5 text-cyan" />
              <span className="text-xs text-muted-foreground">Log Aktivitas Terbaru</span>
            </div>
            <ScrollArea className="h-52 rounded-lg border border-border bg-muted/30 p-2">
              <div className="flex flex-col gap-1">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/60">
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{log.time}</span>
                    <div
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        log.type === "alert" ? "bg-destructive" : log.type === "warning" ? "bg-warning" : "bg-cyan"
                      }`}
                    />
                    <span className="text-xs leading-relaxed text-foreground/80">{log.msg}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

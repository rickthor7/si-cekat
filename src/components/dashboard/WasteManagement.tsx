import { Trash2, Package } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const wasteData = [
  { name: "Organik", value: 280, color: "var(--eco)" },
  { name: "Anorganik", value: 170.5, color: "var(--cyan)" },
];

const containerCapacity = 65;

export function WasteManagement() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Trash2 className="h-4 w-4 text-eco" />
          Waste Management
        </CardTitle>
        <Badge variant="outline" className="border-cyan/40 text-cyan">AI Sorted</Badge>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="rounded-lg border border-border bg-muted/40 p-4 text-center">
          <div className="text-3xl font-semibold tabular-nums text-foreground">450.5</div>
          <div className="mt-1 text-xs text-muted-foreground">Kg Total Terangkat</div>
        </div>

        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Klasifikasi AI</span>
          <div className="h-36 sm:h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={wasteData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value" stroke="none">
                  {wasteData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--popover-foreground)",
                  }}
                  formatter={(value) => [`${value} Kg`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {wasteData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[11px] text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-warning" />
              <span className="text-xs text-muted-foreground">Bak Penampung</span>
            </div>
            <Badge variant="outline" className="border-warning/40 text-warning">{containerCapacity}% · Hampir Penuh</Badge>
          </div>
          <Progress value={containerCapacity} className="h-2 [&>div]:bg-warning" />
        </div>
      </CardContent>
    </Card>
  );
}

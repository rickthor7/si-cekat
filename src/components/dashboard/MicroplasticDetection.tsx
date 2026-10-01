import { useEffect, useState } from "react";
import { Microscope, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  type: "PE" | "PP" | "PS" | "PET";
  confidence: number;
}

const TYPE_COLORS: Record<Particle["type"], string> = {
  PE: "var(--cyan)",
  PP: "var(--eco)",
  PS: "var(--energy)",
  PET: "var(--destructive)",
};

function generateParticles(): Particle[] {
  const types: Particle["type"][] = ["PE", "PP", "PS", "PET"];
  return Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: 8 + Math.random() * 84,
    y: 8 + Math.random() * 84,
    size: 1.2 + Math.random() * 2.8,
    type: types[Math.floor(Math.random() * types.length)],
    confidence: 75 + Math.random() * 24,
  }));
}

export function MicroplasticDetection() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [ppl, setPpl] = useState(248);

  useEffect(() => {
    setParticles(generateParticles());
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setParticles(generateParticles());
      setPpl((p) => Math.max(150, Math.min(420, p + Math.round((Math.random() - 0.5) * 40))));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = (ts - start) % 3000;
      setScanProgress(elapsed / 3000);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const counts = particles.reduce(
    (acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    },
    {} as Record<Particle["type"], number>,
  );

  const dominantType = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "PE") as Particle["type"];
  const riskLevel = ppl > 350 ? "Tinggi" : ppl > 250 ? "Sedang" : "Rendah";
  const riskColor = ppl > 350 ? "text-destructive" : ppl > 250 ? "text-warning" : "text-eco";

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Microscope className="h-4 w-4 text-cyan" />
          Identifikasi Mikroplastik
        </CardTitle>
        <Badge variant="outline" className="border-cyan/40 text-cyan">AI Vision</Badge>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-md border border-border bg-muted/40 p-2.5">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Konsentrasi</div>
            <div className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{ppl}</div>
            <div className="text-[10px] text-muted-foreground">partikel/L</div>
          </div>
          <div className="rounded-md border border-border bg-muted/40 p-2.5">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Dominan</div>
            <div className="mt-0.5 text-lg font-semibold" style={{ color: TYPE_COLORS[dominantType] }}>
              {dominantType}
            </div>
            <div className="text-[10px] text-muted-foreground">polimer</div>
          </div>
          <div className="rounded-md border border-border bg-muted/40 p-2.5">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Risiko</div>
            <div className={`mt-0.5 text-lg font-semibold ${riskColor}`}>{riskLevel}</div>
            <div className="text-[10px] text-muted-foreground">level</div>
          </div>
        </div>

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-[oklch(0.12_0.01_256)] sm:aspect-auto sm:h-[180px]">
          <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <radialGradient id="lensGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="oklch(0.22 0.04 195 / 0.4)" />
                <stop offset="70%" stopColor="oklch(0.14 0.02 256 / 0.3)" />
                <stop offset="100%" stopColor="oklch(0.08 0.01 256 / 0.6)" />
              </radialGradient>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="oklch(0.78 0.15 195 / 0.08)" strokeWidth="0.2" />
              </pattern>
              <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.15 195 / 0)" />
                <stop offset="100%" stopColor="oklch(0.78 0.15 195 / 0.6)" />
              </linearGradient>
            </defs>

            <rect width="100" height="100" fill="url(#lensGrad)" />
            <rect width="100" height="100" fill="url(#grid)" />

            <line x1="50" y1="0" x2="50" y2="100" stroke="oklch(0.78 0.15 195 / 0.25)" strokeWidth="0.2" strokeDasharray="1 1" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="oklch(0.78 0.15 195 / 0.25)" strokeWidth="0.2" strokeDasharray="1 1" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="oklch(0.78 0.15 195 / 0.2)" strokeWidth="0.2" strokeDasharray="2 1" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="oklch(0.78 0.15 195 / 0.2)" strokeWidth="0.2" strokeDasharray="2 1" />

            {particles.map((p) => (
              <g key={p.id}>
                <circle cx={p.x} cy={p.y} r={p.size + 1} fill={TYPE_COLORS[p.type]} opacity="0.15" />
                <circle cx={p.x} cy={p.y} r={p.size} fill={TYPE_COLORS[p.type]} opacity="0.85" stroke={TYPE_COLORS[p.type]} strokeWidth="0.3">
                  <animate attributeName="opacity" values="0.85;0.4;0.85" dur="2s" repeatCount="indefinite" />
                </circle>
                <rect
                  x={p.x - p.size - 0.8}
                  y={p.y - p.size - 0.8}
                  width={(p.size + 0.8) * 2}
                  height={(p.size + 0.8) * 2}
                  fill="none"
                  stroke={TYPE_COLORS[p.type]}
                  strokeWidth="0.15"
                  strokeDasharray="0.5 0.3"
                  opacity="0.6"
                />
              </g>
            ))}

            <line x1="0" y1={scanProgress * 100} x2="100" y2={scanProgress * 100} stroke="oklch(0.78 0.15 195)" strokeWidth="0.3" opacity="0.7" />
            <rect x="0" y={Math.max(0, scanProgress * 100 - 8)} width="100" height="8" fill="url(#scanGrad)" opacity="0.3" />
          </svg>

          <Badge variant="outline" className="pointer-events-none absolute left-2 top-2 border-cyan/40 bg-background/80 font-mono text-[9px] text-cyan backdrop-blur-sm">
            400× ZOOM
          </Badge>
          <Badge variant="outline" className="pointer-events-none absolute right-2 top-2 gap-1 border-eco/40 bg-background/80 font-mono text-[9px] text-eco backdrop-blur-sm">
            <span className="status-dot bg-eco" />
            SCANNING
          </Badge>
          <Badge variant="outline" className="pointer-events-none absolute bottom-2 left-2 bg-background/80 font-mono text-[9px] backdrop-blur-sm">
            {particles.length} partikel
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Klasifikasi Polimer
            </span>
            <div className="flex items-center gap-1 text-[10px] text-eco">
              <TrendingUp className="h-3 w-3" />
              <span>96% akurasi</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(TYPE_COLORS) as Particle["type"][]).map((type) => {
              const count = counts[type] || 0;
              const pct = particles.length ? (count / particles.length) * 100 : 0;
              return (
                <div key={type} className="rounded-md border border-border bg-muted/40 p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold" style={{ color: TYPE_COLORS[type] }}>
                      {type}
                    </span>
                    <span className="text-[10px] tabular-nums text-muted-foreground">{count}</span>
                  </div>
                  <Progress value={pct} className="mt-1.5 h-1" style={{ ["--progress-color" as string]: TYPE_COLORS[type] }} />
                </div>
              );
            })}
          </div>
        </div>

        {ppl > 250 && (
          <Alert className="border-warning/40 bg-warning/5 py-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-[11px] text-foreground">
              Konsentrasi mikroplastik di atas ambang batas WHO (250 partikel/L). Disarankan filtrasi tambahan.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

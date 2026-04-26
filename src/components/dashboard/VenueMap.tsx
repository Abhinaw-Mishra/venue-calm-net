import { useStore } from "@/lib/store";
import { INCIDENT_META } from "@/lib/incident-meta";
import { ZONES, type Zone } from "@/lib/types";

const ZONE_POS: Record<Zone, { x: number; y: number; w: number; h: number }> = {
  "Gate A":     { x: 5,  y: 8,  w: 18, h: 14 },
  "Gate B":     { x: 77, y: 8,  w: 18, h: 14 },
  "Lobby":      { x: 30, y: 12, w: 40, h: 22 },
  "Restaurant": { x: 6,  y: 40, w: 28, h: 22 },
  "Stage":      { x: 38, y: 42, w: 26, h: 24 },
  "Pool Deck":  { x: 68, y: 40, w: 26, h: 22 },
  "Parking":    { x: 18, y: 72, w: 64, h: 20 },
};

export function VenueMap() {
  const alerts = useStore((s) => s.alerts).filter((a) => a.status !== "resolved");

  const counts: Record<Zone, number> = ZONES.reduce((acc, z) => ({ ...acc, [z]: 0 }), {} as Record<Zone, number>);
  alerts.forEach((a) => (counts[a.zone] += 1));

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div>
          <h2 className="font-display text-lg font-semibold">Venue Map</h2>
          <p className="text-xs text-muted-foreground">Live incident locations across zones</p>
        </div>
        <div className="text-xs font-mono text-muted-foreground">{alerts.length} active</div>
      </div>
      <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-background to-secondary/40">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          {ZONES.map((z) => {
            const p = ZONE_POS[z];
            const c = counts[z];
            const fill = c > 0 ? "hsl(var(--critical) / 0.12)" : "hsl(var(--primary) / 0.05)";
            const stroke = c > 0 ? "hsl(var(--critical) / 0.55)" : "hsl(var(--primary) / 0.25)";
            return (
              <g key={z}>
                <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="2" fill={fill} stroke={stroke} strokeWidth="0.3" />
                <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 1} textAnchor="middle" fontSize="2.4" fill="hsl(var(--foreground))" opacity="0.85" fontFamily="Inter">
                  {z}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Pins */}
        <div className="absolute inset-0">
          {alerts.map((a) => {
            const p = ZONE_POS[a.zone];
            // jitter inside zone
            const jx = (parseInt(a.id, 36) % 7) - 3;
            const jy = (parseInt(a.id.slice(2), 36) % 5) - 2;
            const cx = p.x + p.w / 2 + jx;
            const cy = p.y + p.h / 2 + jy;
            const Icon = INCIDENT_META[a.type].icon;
            const color = a.priority === "high" ? "bg-critical" : a.priority === "medium" ? "bg-warning" : "bg-info";
            return (
              <div
                key={a.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${cx}%`, top: `${cy}%` }}
                title={`${INCIDENT_META[a.type].label} — ${a.zone}`}
              >
                <div className={`relative flex h-7 w-7 items-center justify-center rounded-full ${color} text-white shadow-lg`}>
                  <Icon className="h-3.5 w-3.5" />
                  {a.priority === "high" && <span className="absolute inset-0 rounded-full pulse-ring" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { INCIDENT_META } from "@/lib/incident-meta";
import type { IncidentType } from "@/lib/types";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TYPES: IncidentType[] = ["fire", "medical", "crowd", "security"];
const COLORS: Record<IncidentType, string> = {
  fire: "hsl(var(--critical))",
  medical: "hsl(var(--info))",
  crowd: "hsl(var(--warning))",
  security: "hsl(var(--accent))",
};

export function Analytics() {
  const alerts = useStore((s) => s.alerts);

  const byType = useMemo(
    () =>
      TYPES.map((t) => ({
        type: INCIDENT_META[t].label,
        key: t,
        count: alerts.filter((a) => a.type === t).length,
      })),
    [alerts]
  );

  const trend = useMemo(() => {
    // Last 7 buckets of 10-minute windows ending now
    const now = Date.now();
    const bucket = 10 * 60 * 1000;
    return Array.from({ length: 7 }, (_, i) => {
      const end = now - (6 - i) * bucket;
      const start = end - bucket;
      const created = alerts.filter((a) => a.createdAt >= start && a.createdAt < end).length;
      const resolved = alerts.filter((a) => (a.resolvedAt ?? -1) >= start && (a.resolvedAt ?? -1) < end).length;
      return { label: `${60 - i * 10}m`, Created: created, Resolved: resolved };
    });
  }, [alerts]);

  const resolved = alerts.filter((a) => a.status === "resolved").length;
  const rate = alerts.length ? Math.round((resolved / alerts.length) * 100) : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="glass rounded-2xl p-5 lg:col-span-1">
        <h3 className="font-display text-base font-semibold">Incidents by type</h3>
        <p className="text-xs text-muted-foreground">All time</p>
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byType} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="type" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: "hsl(var(--primary) / 0.08)" }} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {byType.map((d) => (
                  <Cell key={d.key} fill={COLORS[d.key as IncidentType]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 lg:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-semibold">Response trend</h3>
            <p className="text-xs text-muted-foreground">Last 70 minutes</p>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Resolution rate</div>
            <div className="font-display text-2xl font-semibold text-success">{rate}%</div>
          </div>
        </div>
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="Created" stroke="hsl(var(--critical))" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Resolved" stroke="hsl(var(--success))" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

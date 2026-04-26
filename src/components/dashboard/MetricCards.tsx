import { Activity, AlertTriangle, CheckCircle2, Timer } from "lucide-react";
import { useStore } from "@/lib/store";
import { useMemo } from "react";

function fmtDuration(ms: number) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  return `${Math.round(m / 60)}h`;
}

export function MetricCards() {
  const alerts = useStore((s) => s.alerts);

  const metrics = useMemo(() => {
    const total = alerts.length;
    const active = alerts.filter((a) => a.status !== "resolved").length;
    const resolved = alerts.filter((a) => a.status === "resolved");
    const avg = resolved.length
      ? resolved.reduce((acc, a) => acc + ((a.resolvedAt ?? a.createdAt) - a.createdAt), 0) / resolved.length
      : 0;
    return { total, active, resolved: resolved.length, avg };
  }, [alerts]);

  const items = [
    { label: "Total Alerts", value: metrics.total, icon: Activity, accent: "from-primary to-primary-glow", text: "text-primary" },
    { label: "Active Emergencies", value: metrics.active, icon: AlertTriangle, accent: "from-critical to-warning", text: "text-critical" },
    { label: "Resolved Cases", value: metrics.resolved, icon: CheckCircle2, accent: "from-success to-info", text: "text-success" },
    { label: "Avg Response Time", value: metrics.avg ? fmtDuration(metrics.avg) : "—", icon: Timer, accent: "from-info to-accent", text: "text-info" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((m, i) => (
        <div key={m.label} className="glass relative overflow-hidden rounded-2xl p-5 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
          <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${m.accent} opacity-15 blur-2xl`} />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{m.label}</div>
              <div className={`mt-2 font-display text-3xl font-semibold ${m.text}`}>{m.value}</div>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/10 ${m.text}`}>
              <m.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

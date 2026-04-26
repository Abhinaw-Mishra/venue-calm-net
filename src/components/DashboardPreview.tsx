import { Activity, Flame, HeartPulse, ShieldAlert, Users } from "lucide-react";

/** Small static visual for the landing hero */
export function DashboardPreview() {
  return (
    <div className="glass-strong relative overflow-hidden rounded-2xl p-5 shadow-elegant">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </span>
            <div className="font-display text-sm font-semibold">Mission Control</div>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-success">
            <span className="h-2 w-2 rounded-full bg-success" /> LIVE
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {[
            { k: "Active", v: "3", c: "text-critical" },
            { k: "Pending", v: "1", c: "text-warning" },
            { k: "Resolved", v: "12", c: "text-success" },
          ].map((s) => (
            <div key={s.k} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
              <div className={`mt-1 font-display text-2xl font-semibold ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {[
            { icon: Flame, title: "Fire — Stage", time: "now", color: "text-critical", bg: "bg-critical/10", ring: "ring-critical/30", pulse: true },
            { icon: HeartPulse, title: "Medical — Lobby", time: "2m", color: "text-warning", bg: "bg-warning/10", ring: "ring-warning/30" },
            { icon: Users, title: "Crowd — Gate B", time: "6m", color: "text-info", bg: "bg-info/10", ring: "ring-info/30" },
            { icon: ShieldAlert, title: "Security — Parking", time: "12m", color: "text-success", bg: "bg-success/10", ring: "ring-success/30" },
          ].map((a) => (
            <div key={a.title} className={`flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3`}>
              <div className="flex items-center gap-3">
                <div className={`relative flex h-9 w-9 items-center justify-center rounded-lg ${a.bg} ring-1 ${a.ring}`}>
                  <a.icon className={`h-4.5 w-4.5 ${a.color}`} />
                  {a.pulse && <span className="absolute inset-0 rounded-lg pulse-ring" />}
                </div>
                <div>
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-[11px] text-muted-foreground">Auto-routed by AI</div>
                </div>
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

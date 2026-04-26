import { useStore } from "@/lib/store";
import { INCIDENT_META, PRIORITY_STYLES, STATUS_STYLES } from "@/lib/incident-meta";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Play, UserPlus, Sparkles } from "lucide-react";

function timeAgo(ts: number) {
  const d = Date.now() - ts;
  const s = Math.round(d / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
}

export function AlertList() {
  const alerts = useStore((s) => s.alerts);
  const assignTeam = useStore((s) => s.assignTeam);
  const startResponse = useStore((s) => s.startResponse);
  const resolve = useStore((s) => s.resolve);

  const active = alerts.filter((a) => a.status !== "resolved");
  const resolved = alerts.filter((a) => a.status === "resolved");

  return (
    <div className="glass rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div>
          <h2 className="font-display text-lg font-semibold">Alert Management</h2>
          <p className="text-xs text-muted-foreground">Triage, assign, and resolve in real time</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-critical"><span className="h-2 w-2 rounded-full bg-critical" /> Critical</span>
          <span className="flex items-center gap-1.5 text-warning"><span className="h-2 w-2 rounded-full bg-warning" /> Pending</span>
          <span className="flex items-center gap-1.5 text-success"><span className="h-2 w-2 rounded-full bg-success" /> Resolved</span>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {active.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">All clear. No active emergencies.</div>
        )}
        {active.map((a) => {
          const meta = INCIDENT_META[a.type];
          const Icon = meta.icon;
          const pStyle = PRIORITY_STYLES[a.priority];
          const sStyle = STATUS_STYLES[a.status];
          const isCritical = a.priority === "high" && a.status !== "resolved";
          return (
            <div key={a.id} className="group px-5 py-4 transition-colors hover:bg-white/[0.02] animate-fade-in">
              <div className="flex flex-wrap items-start gap-4">
                <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] ring-1 ring-white/10`}>
                  <Icon className={`h-5 w-5 ${a.priority === "high" ? "text-critical" : a.priority === "medium" ? "text-warning" : "text-info"}`} />
                  {isCritical && <span className="absolute inset-0 rounded-xl pulse-ring" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-base font-semibold">{meta.emoji} {meta.label}</span>
                    <span className="text-sm text-muted-foreground">· {a.zone}</span>
                    {(a.floor || a.room) && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        🏨 {a.floor && `Floor ${a.floor}`}{a.floor && a.room && " · "}{a.room && `Room ${a.room}`}
                      </span>
                    )}
                    <span className={`ml-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${pStyle.chip}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${pStyle.dot}`} /> {pStyle.label}
                    </span>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${sStyle.chip}`}>{sStyle.label}</span>
                  </div>
                  {a.message && <p className="mt-1 text-sm text-muted-foreground">{a.message}</p>}
                  <div className="mt-2 flex items-start gap-2 rounded-lg border border-primary/15 bg-primary/5 p-2.5">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <div className="text-xs leading-relaxed text-foreground/90">
                      <span className="font-semibold text-primary">AI Suggestion · </span>
                      {a.suggestion}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {timeAgo(a.createdAt)}</span>
                    {a.assignedTeam && <span>👥 {a.assignedTeam}</span>}
                    <span>ID #{a.id.slice(0, 6).toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto">
                  {!a.assignedTeam && (
                    <Button size="sm" variant="outline" onClick={() => assignTeam(a.id)}>
                      <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Assign
                    </Button>
                  )}
                  {a.status === "pending" && (
                    <Button size="sm" className="bg-gradient-warning text-warning-foreground hover:opacity-90" onClick={() => startResponse(a.id)}>
                      <Play className="mr-1.5 h-3.5 w-3.5" /> Start
                    </Button>
                  )}
                  {a.status !== "resolved" && (
                    <Button size="sm" className="bg-gradient-success text-success-foreground hover:opacity-90" onClick={() => resolve(a.id)}>
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Resolve
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {resolved.length > 0 && (
        <details className="border-t border-white/5 px-5 py-4">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            Recently resolved ({resolved.length})
          </summary>
          <ul className="mt-3 space-y-2">
            {resolved.slice(0, 6).map((a) => {
              const meta = INCIDENT_META[a.type];
              return (
                <li key={a.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                  <span>{meta.emoji} {meta.label} · {a.zone}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">resolved {timeAgo(a.resolvedAt ?? a.createdAt)}</span>
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </div>
  );
}

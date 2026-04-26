import { useNavigate } from "react-router-dom";
import { User, ShieldCheck, Siren } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import { toast } from "sonner";

const ROLES: { id: Role; title: string; desc: string; icon: React.ElementType; goto: string; accent: string }[] = [
  { id: "guest", title: "Guest / User", desc: "Report incidents in seconds. See safety broadcasts.", icon: User, goto: "/report", accent: "from-info to-primary" },
  { id: "admin", title: "Admin", desc: "Mission control. Triage, assign, broadcast, analyze.", icon: ShieldCheck, goto: "/dashboard", accent: "from-primary to-accent" },
  { id: "responder", title: "Responder", desc: "On-ground team — claim alerts and update status.", icon: Siren, goto: "/dashboard", accent: "from-warning to-critical" },
];

export function RolePicker() {
  const setRole = useStore((s) => s.setRole);
  const navigate = useNavigate();

  const choose = (r: Role, goto: string) => {
    setRole(r);
    toast.success(`Continuing as ${r}`);
    navigate(goto);
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {ROLES.map((r, i) => (
        <button
          key={r.id}
          onClick={() => choose(r.id, r.goto)}
          className="glass group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow animate-fade-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${r.accent} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-25`} />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] ring-1 ring-white/10">
            <r.icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="relative mt-5 font-display text-xl font-semibold">{r.title}</h3>
          <p className="relative mt-1.5 text-sm text-muted-foreground">{r.desc}</p>
          <div className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Continue
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </button>
      ))}
    </div>
  );
}

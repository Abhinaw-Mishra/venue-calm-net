import { Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Activity className="h-5 w-5 text-primary-foreground" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-critical pulse-ring" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold tracking-tight">Venue Response Hub</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Mission Control</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link to="/report" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">Report</Link>
          <Link to="/dashboard" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          {role && (
            <span className="hidden rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:inline-flex">
              {role.toUpperCase()}
            </span>
          )}
          {role ? (
            <Button variant="ghost" size="sm" onClick={() => setRole(null)}>Switch role</Button>
          ) : (
            <Link to="/"><Button variant="ghost" size="sm">Choose role</Button></Link>
          )}
          <Link to="/report"><Button size="sm" className="bg-gradient-critical text-critical-foreground hover:opacity-90">Report</Button></Link>
        </div>
      </div>
    </header>
  );
}

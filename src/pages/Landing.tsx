import { Link } from "react-router-dom";
import { ArrowRight, ShieldAlert, Radio, Brain, Map as MapIcon, Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { RolePicker } from "@/components/RolePicker";
import { DashboardPreview } from "@/components/DashboardPreview";

const STEPS = [
  { n: "01", title: "Detect & Report", desc: "Anyone in the venue can flag an incident in two taps with auto-zone detection." },
  { n: "02", title: "Coordinate", desc: "Mission control prioritizes, assigns the nearest team, and tracks live status." },
  { n: "03", title: "Resolve", desc: "Broadcast safety updates, log outcomes, and review analytics in one place." },
];

const FEATURES = [
  { icon: Radio, title: "Real-time alerts", desc: "Sub-second propagation of incidents across every connected role." },
  { icon: Brain, title: "AI suggestions", desc: "Context-aware response playbooks the moment an alert arrives." },
  { icon: MapIcon, title: "Venue map", desc: "Visualize active incidents across zones with priority pins." },
  { icon: ShieldAlert, title: "Role-based flows", desc: "Tailored views for guests, responders, and admins." },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="container relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Hospitality Safety OS
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Real-Time Emergency <br />
              Response System for{" "}
              <span className="text-gradient">Smart Venues</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              When seconds matter, fragmented chats and radios fail. Venue Response Hub unifies guests,
              staff, and responders on one mission-control surface — detecting incidents, prioritizing
              them, and orchestrating resolution end to end.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/report">
                <Button size="lg" className="bg-gradient-critical text-critical-foreground shadow-critical hover:opacity-95">
                  <ShieldAlert className="mr-2 h-5 w-5" /> Report Emergency
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-primary/40 bg-primary/5 hover:bg-primary/10">
                  Enter Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: "1.2s", v: "median alert latency" },
                { k: "98%", v: "incidents triaged" },
                { k: "24/7", v: "venue coverage" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-display text-2xl font-semibold text-foreground">{s.k}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-scale-in">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* ROLE PICKER */}
      <section className="container py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Choose how you'll enter</h2>
          <p className="mt-3 text-muted-foreground">Lightweight role selection. No accounts, no friction — exactly what an emergency tool should be.</p>
        </div>
        <RolePicker />
      </section>

      {/* HOW IT WORKS */}
      <section className="container py-16">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">How it works</div>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Three steps from signal to safety</h2>
          </div>
          <p className="max-w-md text-muted-foreground">A linear flow with zero ambiguity — the right person sees the right thing at the right time.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.n} className="glass relative rounded-2xl p-6 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="font-mono text-xs text-primary/80">STEP {s.n}</div>
              <h3 className="mt-2 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/40 to-transparent" />
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-16">
        <div className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Capabilities</div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Built to win the first 60 seconds</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="glass rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center sm:p-14">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" aria-hidden />
          <div className="relative">
            <Activity className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Ready to coordinate response in real time?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Open the dashboard, run the live demo, and watch an end-to-end emergency play out in under 10 seconds.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/dashboard"><Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow">Enter Dashboard</Button></Link>
              <Link to="/report"><Button size="lg" variant="outline">Report Emergency</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="container flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} Venue Response Hub</div>
          <div>Built for safer venues.</div>
        </div>
      </footer>
    </div>
  );
}

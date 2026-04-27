import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity, ArrowRight, BarChart3, Bell, Brain, Calendar, Check, ChevronRight,
  LineChart as LineIcon, Mail, Quote, Sparkles, Star, TrendingUp, Users, Wand2, Zap,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/* ---------- Sample data ---------- */
const trendData = [
  { d: "Mon", bookings: 120, revenue: 38 },
  { d: "Tue", bookings: 138, revenue: 44 },
  { d: "Wed", bookings: 165, revenue: 52 },
  { d: "Thu", bookings: 152, revenue: 49 },
  { d: "Fri", bookings: 220, revenue: 71 },
  { d: "Sat", bookings: 268, revenue: 86 },
  { d: "Sun", bookings: 240, revenue: 78 },
];
const noShowData = [
  { d: "W1", before: 22, after: 14 },
  { d: "W2", before: 24, after: 11 },
  { d: "W3", before: 21, after: 9 },
  { d: "W4", before: 25, after: 7 },
];

const FEATURES = [
  { icon: Brain, title: "AI Booking Prediction", desc: "Forecast demand by hour, table, and channel with 92% accuracy." },
  { icon: Calendar, title: "Smart Scheduling", desc: "Auto-arrange tables, rooms, and staff to maximize occupancy." },
  { icon: Users, title: "Customer Behavior Insights", desc: "See who's likely to return — and who's likely to ghost." },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Live dashboards for revenue, covers, and channel mix." },
  { icon: Bell, title: "Automated Reminders", desc: "Multi-channel nudges that cut no-shows by up to 60%." },
  { icon: Zap, title: "1-click Integrations", desc: "Connect OpenTable, Booking.com, Stripe, and your POS." },
];

const STATS = [
  { k: "100+", v: "venues onboarded" },
  { k: "30%", v: "avg revenue lift" },
  { k: "60%", v: "fewer no-shows" },
  { k: "1.2M", v: "bookings managed" },
];

const TESTIMONIALS = [
  { name: "Aanya Mehta", role: "GM, The Olive Tree", quote: "We cut no-shows in half within a month. Felt like adding a full revenue manager — without the headcount." },
  { name: "Marco Rossi", role: "Owner, Trattoria Bella", quote: "Friday nights used to be chaos. Now the AI tells us exactly when to over-book and by how much." },
  { name: "Priya Nair", role: "Director, Coastline Resorts", quote: "Occupancy is up 28% and our team finally has clean dashboards. It paid for itself in 3 weeks." },
];

const PRICING = [
  { name: "Basic", price: "Free", period: "14-day trial", desc: "For small cafes & B&Bs", cta: "Start free", features: ["Up to 200 bookings/mo", "Email reminders", "Basic analytics", "1 location"] },
  { name: "Pro", price: "₹999", period: "/ month", desc: "For growing venues", cta: "Get started", popular: true, features: ["Unlimited bookings", "AI no-show prediction", "Smart scheduling", "WhatsApp + SMS reminders", "Up to 5 locations"] },
  { name: "Enterprise", price: "Custom", period: "tailored", desc: "Hotel groups & chains", cta: "Talk to sales", features: ["Dedicated success manager", "Custom integrations", "SSO + audit logs", "Unlimited locations", "SLA & priority support"] },
];

/* ---------- AI Demo helper ---------- */
function predictBest(date: string, time: string, party: number) {
  if (!date || !time) return null;
  const hour = Number(time.split(":")[0] ?? 19);
  const day = new Date(date).getDay(); // 0 sun .. 6 sat
  const peak = (day === 5 || day === 6) ? 1 : 0;
  // probability of no-show (0..1) — heuristic
  let p = 0.18 + (party >= 6 ? 0.15 : 0) + (hour >= 21 ? 0.1 : 0) - peak * 0.05;
  p = Math.max(0.04, Math.min(0.78, p));
  // suggested better slot
  const suggestHour = peak ? Math.min(hour + 1, 21) : Math.max(hour - 1, 18);
  const slot = `${String(suggestHour).padStart(2, "0")}:30`;
  const confidence = Math.round((1 - Math.abs(0.5 - p)) * 100);
  const expectedRev = Math.round(party * (peak ? 1850 : 1400) * (1 - p));
  return { p, slot, confidence, expectedRev };
}

export default function Booking() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [party, setParty] = useState(4);
  const [email, setEmail] = useState("");

  const prediction = useMemo(() => predictBest(date, time, party), [date, time, party]);

  return (
    <div className="min-h-screen scroll-smooth">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/booking" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-base font-semibold tracking-tight">Bookwise<span className="text-primary">.ai</span></div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Smart Hospitality</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <a href="#features" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#demo" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">AI Demo</a>
            <a href="#dashboard" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">Dashboard</a>
            <a href="#pricing" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
            <Link to="/" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">Response Hub</Link>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#contact"><Button size="sm" variant="ghost">Sign in</Button></a>
            <a href="#contact"><Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">Get Started</Button></a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
        <div className="container relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> New · GPT-powered booking engine
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              AI-Powered <span className="text-gradient">Smart Booking</span> & Venue Management
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Reduce no-shows. Increase revenue. Automate your hospitality operations — with one calm dashboard your whole team will love.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="#demo">
                <Button size="lg" variant="outline" className="border-primary/40 bg-primary/5 hover:bg-primary/10">
                  View Demo
                </Button>
              </a>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.v}>
                  <div className="font-display text-2xl font-semibold text-foreground">{s.k}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero dashboard preview */}
          <div className="animate-scale-in">
            <div className="glass-strong relative overflow-hidden rounded-2xl p-5 shadow-elegant">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" aria-hidden />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" aria-hidden />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary">
                      <Activity className="h-4 w-4 text-primary-foreground" />
                    </span>
                    <div className="font-display text-sm font-semibold">Bookwise · Today</div>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-success">
                    <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> LIVE
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  {[
                    { k: "Bookings", v: "248", c: "text-primary" },
                    { k: "Revenue", v: "₹1.2L", c: "text-success" },
                    { k: "No-show", v: "6%", c: "text-warning" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
                      <div className={`mt-1 font-display text-xl font-semibold ${s.c}`}>{s.v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 h-40 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Area type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" fill="url(#hg)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 ring-1 ring-accent/30">
                      <Wand2 className="h-4 w-4 text-accent" />
                    </span>
                    <div>
                      <div className="text-sm font-medium">AI suggests over-booking 3 tables · 8pm</div>
                      <div className="text-[11px] text-muted-foreground">Confidence 91% · Expected lift ₹14,500</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM → SOLUTION → IMPACT */}
      <section className="container py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why Bookwise</div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">From chaos to clarity in one switch</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { tag: "Problem", color: "text-critical", bg: "bg-critical/10", ring: "ring-critical/30", title: "Manual booking & costly no-shows", desc: "Spreadsheets, missed calls, ghost reservations and revenue leaking out every night." },
            { tag: "Solution", color: "text-primary", bg: "bg-primary/10", ring: "ring-primary/30", title: "AI prediction + smart scheduling", desc: "Predict no-show risk, optimize table & room mix, and automate reminders across channels." },
            { tag: "Impact", color: "text-success", bg: "bg-success/10", ring: "ring-success/30", title: "More revenue, happier guests", desc: "30% revenue lift on average, calmer ops, and customers who actually show up." },
          ].map((c, i) => (
            <div key={c.tag} className="glass relative rounded-2xl p-6 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <span className={`inline-flex items-center rounded-full ${c.bg} ring-1 ${c.ring} px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${c.color}`}>{c.tag}</span>
              <h3 className="mt-4 font-display text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container py-20">
        <div className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Features</div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Everything your front desk wishes it had</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="glass group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI DEMO */}
      <section id="demo" className="container py-20">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-10">
          <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />
          <div className="relative grid gap-8 lg:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Live AI Demo</div>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Try the booking brain</h2>
              <p className="mt-3 text-muted-foreground">Pick a date, time and party size. Our model suggests the best slot and predicts no-show risk in real time.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs text-muted-foreground">Date</label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Time</label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Party size</label>
                  <Input type="number" min={1} max={20} value={party} onChange={(e) => setParty(Math.max(1, Number(e.target.value) || 1))} className="mt-1" />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button onClick={() => !date && toast.message("Pick a date to run the prediction")}
                  className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
                  <Wand2 className="mr-2 h-4 w-4" /> Run AI prediction
                </Button>
                <Button variant="outline" onClick={() => { setDate(""); setTime("19:00"); setParty(4); }}>Reset</Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-accent" />
                  <span className="font-display text-sm font-semibold">Prediction</span>
                </div>
                <span className="text-[11px] text-muted-foreground">Bookwise model v3.2</span>
              </div>

              {!prediction ? (
                <div className="mt-10 flex h-48 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-muted-foreground">
                  Pick a date to see the AI suggestion
                </div>
              ) : (
                <div className="mt-5 space-y-4 animate-fade-in">
                  <div className="rounded-xl border border-white/5 bg-background/40 p-4">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Recommended slot</div>
                    <div className="mt-1 font-display text-2xl font-semibold text-primary">{prediction.slot}</div>
                    <div className="text-xs text-muted-foreground">Confidence {prediction.confidence}%</div>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-background/40 p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="uppercase tracking-wider text-muted-foreground">No-show probability</span>
                      <span className={prediction.p > 0.4 ? "text-critical font-semibold" : prediction.p > 0.25 ? "text-warning font-semibold" : "text-success font-semibold"}>
                        {(prediction.p * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${prediction.p > 0.4 ? "bg-critical" : prediction.p > 0.25 ? "bg-warning" : "bg-success"}`}
                        style={{ width: `${prediction.p * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-background/40 p-4">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">Expected revenue</div>
                      <div className="mt-1 font-display text-xl font-semibold text-success">₹{prediction.expectedRev.toLocaleString()}</div>
                    </div>
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="dashboard" className="container py-20">
        <div className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">One screen. Every signal.</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="glass rounded-2xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><LineIcon className="h-4 w-4 text-primary" /><span className="font-display text-sm font-semibold">Bookings & Revenue · 7d</span></div>
              <span className="text-[11px] text-muted-foreground">₹ in thousands</span>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-success" /><span className="font-display text-sm font-semibold">No-show rate · before vs after</span></div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={noShowData}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="before" fill="hsl(var(--critical))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="after" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container py-20">
        <div className="mb-10 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Loved by operators</div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Trusted by 100+ venues across 12 countries</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="glass rounded-2xl p-6 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <Quote className="h-6 w-6 text-primary/70" />
              <p className="mt-3 text-sm text-foreground/90">"{t.quote}"</p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
                <div className="flex gap-0.5 text-warning">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-current" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="container py-20">
        <div className="mb-10 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Pricing</div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Simple plans. Serious ROI.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {PRICING.map((p) => (
            <div key={p.name} className={`relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${p.popular ? "glass-strong shadow-glow ring-1 ring-primary/40" : "glass"}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground shadow-glow">
                  Most popular
                </span>
              )}
              <div className="font-display text-lg font-semibold">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.desc}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="mt-6 block">
                <Button className={`w-full ${p.popular ? "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95" : ""}`} variant={p.popular ? "default" : "outline"}>
                  {p.cta}
                </Button>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="container py-20">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center sm:p-14">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <Mail className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Book a 15-min demo</h2>
            <p className="mx-auto mt-3 text-muted-foreground">See Bookwise on your venue's data. No credit card needed.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) return toast.error("Please enter your email");
                toast.success("Demo request received! We'll be in touch within 24h.");
                setEmail("");
              }}
              className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder="you@yourvenue.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 flex-1"
                required
              />
              <Button type="submit" size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
                Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="container flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} Bookwise.ai · Smart hospitality, on autopilot.</div>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <Link to="/" className="hover:text-foreground">Response Hub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

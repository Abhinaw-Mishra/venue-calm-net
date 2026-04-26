import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, MapPin, Send, Hotel } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { INCIDENT_META, PRIORITY_STYLES } from "@/lib/incident-meta";
import { ZONES, type IncidentType, type Zone } from "@/lib/types";
import { toast } from "sonner";

const TYPES: IncidentType[] = ["fire", "medical", "crowd", "security"];

export default function Report() {
  const navigate = useNavigate();
  const role = useStore((s) => s.role) ?? "guest";
  const addAlert = useStore((s) => s.addAlert);

  const [type, setType] = useState<IncidentType | null>(null);
  const [zone, setZone] = useState<Zone>("Lobby");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState<null | { id: string; priority: string; zone: Zone; type: IncidentType; createdAt: number; floor?: string; room?: string }>(null);

  const submit = () => {
    if (!type) return;
    const a = addAlert({ type, zone, message: message.trim() || undefined, reporter: role, floor, room });
    const locBits = [a.floor && `Floor ${a.floor}`, a.room && `Room ${a.room}`].filter(Boolean).join(" · ");
    toast.success("🚨 Emergency reported successfully", { description: `Priority ${a.priority.toUpperCase()} • ${zone}${locBits ? ` • ${locBits}` : ""}` });
    setSubmitted({ id: a.id, priority: a.priority, zone: a.zone, type: a.type, createdAt: a.createdAt, floor: a.floor, room: a.room });
  };

  if (submitted) {
    const meta = INCIDENT_META[submitted.type];
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="container max-w-2xl py-16">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center animate-scale-in">
            <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 ring-1 ring-success/30">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">🚨 Emergency reported successfully</h1>
              <p className="mt-2 text-muted-foreground">Mission control has been notified. Help is on the way.</p>

              <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3 text-left">
                <Stat label="Type" value={`${meta.emoji} ${meta.label}`} />
                <Stat label="Zone" value={submitted.zone} />
                <Stat label="Priority">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[submitted.priority as "high"].chip}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_STYLES[submitted.priority as "high"].dot}`} />
                    {submitted.priority.toUpperCase()}
                  </span>
                </Stat>
              </div>

              <div className="mt-3 font-mono text-xs text-muted-foreground">
                Reported {new Date(submitted.createdAt).toLocaleTimeString()} • ID #{submitted.id.slice(0, 6).toUpperCase()}
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button onClick={() => navigate("/dashboard")} className="bg-gradient-primary text-primary-foreground shadow-glow">
                  View on Dashboard
                </Button>
                <Button variant="outline" onClick={() => { setSubmitted(null); setType(null); setMessage(""); }}>
                  Report another
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container max-w-3xl py-12">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Report an emergency</h1>
        <p className="mt-2 text-muted-foreground">Two taps. One message. Mission control is watching.</p>

        <section className="glass mt-8 rounded-2xl p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">1 · Incident type</div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TYPES.map((t) => {
              const m = INCIDENT_META[t];
              const active = type === t;
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 ${
                    active
                      ? "border-primary/60 bg-primary/10 shadow-glow"
                      : "border-white/5 bg-white/[0.02] hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  <div className="text-2xl">{m.emoji}</div>
                  <div className="mt-2 font-display text-base font-semibold">{m.label}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">Default: {m.defaultPriority.toUpperCase()}</div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="glass mt-5 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> 2 · Zone
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {ZONES.map((z) => (
              <button
                key={z}
                onClick={() => setZone(z)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  zone === z
                    ? "border-primary/50 bg-primary/15 text-primary"
                    : "border-white/5 bg-white/[0.02] text-muted-foreground hover:text-foreground"
                }`}
              >
                {z}
              </button>
            ))}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">Auto-detected zone from your location: <span className="text-foreground">{zone}</span></div>
        </section>

        <section className="glass mt-5 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Hotel className="h-3.5 w-3.5" /> 3 · Hotel location <span className="font-normal normal-case text-muted-foreground/70">(optional)</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Floor</label>
              <Input
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="e.g. 4"
                inputMode="numeric"
                maxLength={4}
                className="mt-1 border-white/5 bg-white/[0.02]"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Room number</label>
              <Input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. 506"
                maxLength={8}
                className="mt-1 border-white/5 bg-white/[0.02]"
              />
            </div>
          </div>
          {(floor || room) && (
            <div className="mt-3 text-xs text-muted-foreground">
              Responders will be guided to <span className="text-foreground">{zone}{floor && ` · Floor ${floor}`}{room && ` · Room ${room}`}</span>
            </div>
          )}
        </section>

        <section className="glass mt-5 rounded-2xl p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">4 · Message <span className="font-normal normal-case text-muted-foreground/70">(optional)</span></div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Briefly describe what's happening…"
            className="mt-3 min-h-[100px] resize-none border-white/5 bg-white/[0.02]"
          />
        </section>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">Reporting as <span className="font-medium text-foreground">{role}</span></div>
          <Button
            size="lg"
            disabled={!type}
            onClick={submit}
            className="bg-gradient-critical text-critical-foreground shadow-critical hover:opacity-95 disabled:opacity-40 disabled:shadow-none"
          >
            <Send className="mr-2 h-4 w-4" /> Submit emergency
          </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-base font-semibold">{children ?? value}</div>
    </div>
  );
}

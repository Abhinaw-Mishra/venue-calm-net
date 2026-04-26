import { useState } from "react";
import { Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { AlertList } from "@/components/dashboard/AlertList";
import { VenueMap } from "@/components/dashboard/VenueMap";
import { BroadcastPanel } from "@/components/dashboard/BroadcastPanel";
import { Analytics } from "@/components/dashboard/Analytics";
import { useSimulator, runLiveDemo } from "@/lib/simulator";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export default function Dashboard() {
  const [live, setLive] = useState(true);
  const reset = useStore((s) => s.reset);
  useSimulator(live);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="container py-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span className={`h-2 w-2 rounded-full ${live ? "bg-success" : "bg-muted-foreground"} ${live ? "animate-pulse" : ""}`} />
              Mission Control · {live ? "Live" : "Paused"}
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Operations Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Monitor, coordinate, and resolve venue emergencies in real time.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => { setLive((v) => !v); toast(live ? "Simulation paused" : "Simulation resumed"); }}
            >
              {live ? <><Pause className="mr-1.5 h-4 w-4" /> Pause sim</> : <><Play className="mr-1.5 h-4 w-4" /> Resume sim</>}
            </Button>
            <Button variant="outline" onClick={() => { reset(); toast("Dashboard reset"); }}>
              <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
            </Button>
            <Button onClick={() => runLiveDemo()} className="bg-gradient-primary text-primary-foreground shadow-glow">
              <Sparkles className="mr-1.5 h-4 w-4" /> Run Live Demo
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <MetricCards />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <VenueMap />
            <AlertList />
          </div>
          <div className="space-y-6">
            <BroadcastPanel />
          </div>
        </div>

        <div className="mt-6">
          <Analytics />
        </div>
      </div>
    </div>
  );
}

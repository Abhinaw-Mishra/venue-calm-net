import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { INCIDENT_META, suggestionFor } from "@/lib/incident-meta";
import { ZONES, type IncidentType } from "@/lib/types";
import { toast } from "sonner";

const TYPES: IncidentType[] = ["fire", "medical", "crowd", "security"];

/**
 * Background simulator: occasionally injects new alerts and progresses pending ones.
 * Runs while mounted (i.e. while the dashboard is open).
 */
export function useSimulator(active: boolean) {
  const tick = useRef(0);
  const addAlert = useStore((s) => s.addAlert);
  const alerts = useStore((s) => s.alerts);
  const startResponse = useStore((s) => s.startResponse);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      tick.current += 1;
      // ~every 18s spawn a new alert
      if (tick.current % 6 === 0) {
        const type = TYPES[Math.floor(Math.random() * TYPES.length)];
        const zone = ZONES[Math.floor(Math.random() * ZONES.length)];
        const a = addAlert({ type, zone, reporter: "responder" });
        toast(`🚨 New ${INCIDENT_META[type].label} alert detected in ${zone}`, {
          description: a.suggestion,
        });
      }
      // progress oldest pending
      if (tick.current % 4 === 0) {
        const oldest = [...alerts].reverse().find((a) => a.status === "pending");
        if (oldest) startResponse(oldest.id);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [active, addAlert, alerts, startResponse]);
}

/** Scripted "Run Live Demo" sequence */
export async function runLiveDemo() {
  const store = useStore.getState();
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  toast("🎬 Live demo starting…", { description: "Simulating end-to-end emergency flow." });
  await wait(900);

  const alert = store.addAlert({ type: "fire", zone: "Stage", message: "Smoke detected near rigging", reporter: "guest" });
  toast.error(`🔥 Fire reported at Stage`, { description: suggestionFor("fire", "Stage") });
  await wait(1600);

  useStore.getState().assignTeam(alert.id, "Alpha Fire Squad");
  toast(`👥 Team assigned: Alpha Fire Squad`);
  await wait(1500);

  useStore.getState().startResponse(alert.id);
  toast(`🚒 Response in progress at Stage`);
  await wait(2200);

  useStore.getState().resolve(alert.id);
  toast.success(`✅ Incident resolved`, { description: "Stage is safe. Operations restored." });
}

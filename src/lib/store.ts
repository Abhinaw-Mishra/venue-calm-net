import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Alert, AlertStatus, Broadcast, IncidentType, Role, Zone } from "./types";
import { INCIDENT_META, suggestionFor, TEAMS } from "./incident-meta";
import { ZONES } from "./types";

interface State {
  role: Role | null;
  alerts: Alert[];
  broadcasts: Broadcast[];
  setRole: (r: Role | null) => void;
  addAlert: (input: { type: IncidentType; zone: Zone; message?: string; reporter?: Role }) => Alert;
  updateAlert: (id: string, patch: Partial<Alert>) => void;
  assignTeam: (id: string, team?: string) => void;
  startResponse: (id: string) => void;
  resolve: (id: string) => void;
  addBroadcast: (b: Omit<Broadcast, "id" | "createdAt">) => void;
  reset: () => void;
}

const id = () => Math.random().toString(36).slice(2, 10);

const seed = (): Alert[] => {
  const now = Date.now();
  return [
    {
      id: id(), type: "medical", status: "in_progress", priority: "high",
      zone: "Lobby", message: "Guest collapsed near reception", createdAt: now - 1000 * 60 * 12,
      assignedTeam: "Bravo Medical Unit", reporter: "guest",
      suggestion: suggestionFor("medical", "Lobby"),
    },
    {
      id: id(), type: "crowd", status: "pending", priority: "medium",
      zone: "Stage", message: "Density rising fast at front rail", createdAt: now - 1000 * 60 * 4,
      reporter: "responder", suggestion: suggestionFor("crowd", "Stage"),
    },
    {
      id: id(), type: "security", status: "resolved", priority: "high",
      zone: "Parking", createdAt: now - 1000 * 60 * 55, resolvedAt: now - 1000 * 60 * 30,
      assignedTeam: "Charlie Security Team", reporter: "guest",
      suggestion: suggestionFor("security", "Parking"),
    },
    {
      id: id(), type: "fire", status: "resolved", priority: "high",
      zone: "Restaurant", createdAt: now - 1000 * 60 * 180, resolvedAt: now - 1000 * 60 * 165,
      assignedTeam: "Alpha Fire Squad", reporter: "responder",
      suggestion: suggestionFor("fire", "Restaurant"),
    },
  ];
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      role: null,
      alerts: seed(),
      broadcasts: [
        { id: id(), message: "Routine evening safety check completed in all zones.", zone: "All Zones", createdAt: Date.now() - 1000 * 60 * 25 },
      ],
      setRole: (role) => set({ role }),
      addAlert: ({ type, zone, message, reporter = "guest" }) => {
        const meta = INCIDENT_META[type];
        const alert: Alert = {
          id: id(),
          type,
          status: "pending",
          priority: meta.defaultPriority,
          zone,
          message,
          createdAt: Date.now(),
          reporter,
          suggestion: suggestionFor(type, zone),
        };
        set({ alerts: [alert, ...get().alerts] });
        return alert;
      },
      updateAlert: (id, patch) =>
        set({ alerts: get().alerts.map((a) => (a.id === id ? { ...a, ...patch } : a)) }),
      assignTeam: (id, team) => {
        const t = team ?? TEAMS[Math.floor(Math.random() * TEAMS.length)];
        get().updateAlert(id, { assignedTeam: t });
      },
      startResponse: (id) => {
        const a = get().alerts.find((x) => x.id === id);
        const team = a?.assignedTeam ?? TEAMS[Math.floor(Math.random() * TEAMS.length)];
        get().updateAlert(id, { status: "in_progress" as AlertStatus, assignedTeam: team });
      },
      resolve: (id) => get().updateAlert(id, { status: "resolved", resolvedAt: Date.now() }),
      addBroadcast: (b) =>
        set({ broadcasts: [{ ...b, id: id(), createdAt: Date.now() }, ...get().broadcasts].slice(0, 30) }),
      reset: () => set({ alerts: seed(), broadcasts: [] }),
    }),
    {
      name: "vrh-store-v1",
      partialize: (s) => ({ role: s.role }),
    }
  )
);

export { ZONES };
void ZONES;
